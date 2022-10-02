import queryString from 'query-string';
import chalk from 'chalk';

const privateMetaAttributes = ['id', 'accessCode'];

class SocketsManager {
  constructor() {
    this.sockets = new Map();
  }

  /**
   * Validates new socket connection:
   *    * allowed only one client and many controllers
   *    * accessCode must be present
   *
   * @param {*} connectionInfo Query params of connection
   * @returns {Boolean} is valid connection
   */
  validateSocketConnectionInfo(connectionInfo) {
    // ID
    if (!connectionInfo.id) {
      console.error(
        chalk.red('[sockets][validateSocketConnectionInfo][error] missing id'),
        connectionInfo
      );

      return {
        valid: false,
        code: 4003,
        reason: 'missing id',
      };
    }

    // ACCESS CODE
    if (!connectionInfo.accessCode) {
      console.error(
        chalk.red('[sockets][validateSocketConnectionInfo][error] missing accessCode'),
        connectionInfo
      );

      return {
        valid: false,
        code: 4000,
        reason: 'missing accessCode',
      };
    }

    // CLIENT ONLY
    if (connectionInfo.client === 'true') {
      // NAME
      if (!connectionInfo.name) {
        console.error(
          chalk.red('[sockets][validateSocketConnectionInfo][error] missing name'),
          connectionInfo
        );

        return {
          valid: false,
          code: 4004,
          reason: 'missing name',
        };
      }

      const existingClients = this.filterSocketsByMeta(
        (meta) => meta.client === true && meta.accessCode === connectionInfo.accessCode
      );

      if (existingClients.length > 0) {
        let replace = false;

        existingClients.forEach((socket) => {
          const meta = this.getMeta(socket);

          if (meta.id === connectionInfo.id) {
            console.error(
              chalk.bgYellow('[sockets][validateSocketConnectionInfo] replace existing client'),
              JSON.stringify(connectionInfo)
            );

            replace = true;

            socket.close(4002, 'replaced by new client');
            this.onClose(socket);
          }
        });

        if (replace) {
          return {
            valid: true,
          };
        }

        console.error(
          chalk.red('[sockets][validateSocketConnectionInfo][error] client already exists'),
          JSON.stringify(connectionInfo)
        );

        return {
          valid: false,
          code: 4001,
          reason: 'accessCode already in use',
        };
      }
    }

    return { valid: true };
  }

  /**
   * Adds validated new socket to pool and broadcasts `pair` action if needed
   *
   * @param {*} socket incoming socket
   * @param {*} request express connection request
   * @returns {Boolean} is socket and connection info valid?
   */
  onConnect(socket, request) {
    socket.isAlive = true;

    const [, params] = request.url.split('?') ?? [];
    const connectionInfo = queryString.parse(params);
    const { valid, code, reason } = this.validateSocketConnectionInfo(connectionInfo);

    if (!valid) {
      socket.close(code, reason);

      return;
    }

    this.sockets.set(socket, {
      id: connectionInfo.id,
      name: connectionInfo.name,
      client: connectionInfo.client === 'true',
      accessCode: connectionInfo.accessCode,
    });

    console.log(chalk.green('[sockets][onConnect]'), this.getSerializedInfo(socket));

    this.pair(socket);
  }

  /**
   * Removes socket from pool and broadcasts 'unpair' action if needed
   *
   * @param {*} socket
   */
  onClose(socket) {
    console.log(chalk.yellow('[sockets][onClose]'), this.getSerializedInfo(socket));

    if (this.isPaired(socket)) {
      const socketInfo = this.getSerializedInfo(socket);
      const isClient = this.isClient(socket);
      const meta = this.getMeta(socket);
      const clientSocket = isClient ? socket : this.getPairedClient(socket);
      const controllers = this.filterSocketsByMeta(
        (controllerMeta) =>
          controllerMeta.client === false && controllerMeta.accessCode === meta.accessCode
      );

      // Notify all controllers if no client
      if (isClient) {
        console.log(chalk.yellowBright('[sockets][onClose][unpair] no client'), socketInfo);

        controllers.forEach((controllerSocket) => {
          this.send(controllerSocket, {
            type: 'UNPAIRED',
          });
        });
      } else {
        // Notify client if no controllers left
        const controllersLeft = controllers.filter(
          (controllerSocket) => controllerSocket !== socket
        );

        if (controllersLeft.length === 0) {
          console.log(chalk.yellowBright('[sockets][onClose][unpair] no controllers'), socketInfo);

          this.send(clientSocket, { type: 'UNPAIRED' });
        }
      }
    }

    // Delete socket from pool
    this.sockets.delete(socket);
  }

  /**
   * Broadcasts 'pair' action if all conditions are met.
   *
   * @param {*} socket
   */
  pair(socket) {
    const meta = this.getMeta(socket);
    const clientSocket = this.isClient(socket) ? socket : this.getPairedClient(socket);
    const controllers = this.filterSocketsByMeta(
      (controllerMeta) =>
        controllerMeta.client === false && controllerMeta.accessCode === meta.accessCode
    );

    if (clientSocket != null && controllers.length > 0) {
      // Broadcasts `pair` action with delay because newly connected socket might not get it
      setTimeout(() => {
        const controllersMetaSafe = [];
        const clientMetaSafe = this.getMetaSafe(clientSocket);

        controllers.forEach((controllerSocket) => {
          controllersMetaSafe.push(this.getMetaSafe(controllerSocket));

          this.send(controllerSocket, {
            type: 'PAIRED',
            payload: clientMetaSafe,
          });
        });

        this.send(clientSocket, {
          type: 'PAIRED',
          payload: controllersMetaSafe,
        });

        console.log(chalk.greenBright('[sockets][pair]'), this.getSerializedInfo(socket));
      }, 300);
    }
  }

  /**
   * Send message over provided socket
   *
   * @param {*} socket
   * @param {*} message
   * @returns {*}
   */
  send(socket, message) {
    try {
      const msg = JSON.stringify(message);
      const socketInfo = this.getSerializedInfo(socket);

      if (!socket) {
        console.error(chalk.red("[sockets][send][error] socket doesn't exits"), message['type']);

        return;
      }

      if (!message || Object.keys(message).length === 0) {
        console.error(chalk.red('[sockets][send][error] message is empty'), socketInfo);

        return;
      }

      console.log('[sockets][send]', message['type'], '==>', socketInfo);

      socket.send(msg);
    } catch (error) {
      console.error(chalk.red('[sockets][send][error] cant parse message'), message);
    }
  }

  getMeta(socket) {
    const meta = this.sockets.get(socket);

    if (meta) {
      return meta;
    }
  }

  getMetaSafe(socket) {
    const meta = this.getMeta(socket);

    if (meta) {
      return this.__makeMetaSafe(meta);
    }
  }

  getPairedClient(socket) {
    const socketInfo = this.getSerializedInfo(socket);

    if (this.isController(socket)) {
      const meta = this.getMeta(socket);

      if (!meta) {
        this.sockets.delete(socket);

        return;
      }

      const clients = this.filterSocketsByMeta(
        (clientMeta) => clientMeta.client === true && clientMeta.accessCode === meta.accessCode
      );

      if (clients.length === 1) {
        return clients[0];
      } else if (clients.length > 1) {
        // @TODO send ping-pong to all clients
        console.error(
          chalk.red(`[sockets][getPairedClient] too many clients (${clients.length})`),
          socketInfo
        );
      }
    } else {
      console.error(
        chalk.red('[sockets][getPairedClient] only controllers can get clients'),
        socketInfo
      );
    }
  }

  getPairedControllers(socket) {
    if (this.isClient(socket)) {
      const meta = this.getMeta(socket);

      return this.filterSocketsByMeta(
        (clientMeta) => clientMeta.client === false && clientMeta.accessCode === meta.accessCode
      );
    } else {
      console.error(
        chalk.red('[sockets][getPairedControllers] only client can get controllers'),
        this.getSerializedInfo(socket)
      );
    }

    return [];
  }

  filterSocketsByMeta(comparator = () => true) {
    const result = [];

    for (const [socket, meta] of this.sockets) {
      if (comparator(meta)) {
        result.push(socket);
      }
    }

    return result;
  }

  findSocketByMeta(comparator = () => true) {
    for (const [socket, meta] of this.sockets) {
      if (comparator(meta)) {
        return socket;
      }
    }
  }

  getSerializedInfo(socket) {
    const meta = this.getMeta(socket);

    if (meta) {
      const id = meta.id != null && `[${meta.id}]`;

      return `[${meta.client ? 'client' : 'controller'}][${meta.name}]${id}`;
    }
  }

  isController(socket) {
    return this.isClient(socket) === false;
  }

  isClient(socket) {
    const meta = this.getMeta(socket);

    if (meta) {
      return meta.client === true;
    }

    return false;
  }

  isPaired(socket) {
    const meta = this.getMeta(socket);
    const clientSocket = this.isClient(socket) ? socket : this.getPairedClient(socket);
    const controllers = this.filterSocketsByMeta(
      (controllerMeta) =>
        controllerMeta.client === false && controllerMeta.accessCode === meta.accessCode
    );

    return clientSocket != null && controllers?.length > 0;
  }

  static maxAccessCodeGenerationRetries = 15;

  generateAccessCode(retry = 0) {
    if (retry >= SocketsManager.maxAccessCodeGenerationRetries) {
      return null;
    }

    const accessCode = SocketsManager.generateRandomAccessCode();

    if (this.isAccessCodeAvailable(accessCode)) {
      return accessCode;
    } else {
      return this.generateAccessCode(retry + 1);
    }
  }

  isAccessCodeAvailable(accessCode) {
    return (
      this.findSocketByMeta((meta) => meta.isClient === true && meta.accessCode === accessCode) ==
      null
    );
  }

  __makeMetaSafe = (meta) => {
    const safeMeta = { ...meta };

    privateMetaAttributes.forEach((attr) => {
      delete safeMeta[attr];
    });

    return safeMeta;
  };

  static generateRandomAccessCode() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const charactersLength = characters.length;

    let result = '';

    for (let i = 0; i < 4; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
  }

  get listMetaSafe() {
    return [...this.sockets.values()].map(this.__makeMetaSafe);
  }
}

export const sockets = new SocketsManager();
