import queryString from 'query-string';
import chalk from 'chalk';

const privateMetaAttributes = ['accessCode'];

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
    if (!connectionInfo.accessCode) {
      console.error(
        chalk.red('[sockets][validateSocketConnectionInfo][error] missing accessCode'),
        connectionInfo
      );

      return {
        valid: false,
        code: 3000,
        reason: 'missing accessCode',
      };
    }

    if (connectionInfo.client === 'true') {
      const existingClients = this.filterSocketsByMeta(
        (meta) => meta.client === true && meta.accessCode === connectionInfo.accessCode
      );

      if (existingClients.length > 0) {
        let replace = false;

        existingClients.forEach((client) => {
          const meta = this.getMeta(client);

          if (meta.playerId === connectionInfo.playerId) {
            console.error(
              chalk.bgYellow('[sockets][validateSocketConnectionInfo] replace existing client'),
              JSON.stringify(connectionInfo)
            );

            replace = true;

            client.close(3005, 'new client connected');
            this.onClose(client);
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
          code: 3000,
          reason: 'client already exists',
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
    const [, params] = request.url.split('?') ?? [];
    const connectionInfo = queryString.parse(params);
    const { valid, code, reason } = this.validateSocketConnectionInfo(connectionInfo);

    if (!valid) {
      socket.close(code, reason);
    }

    this.sockets.set(socket, {
      id: connectionInfo.id,
      playerId: connectionInfo.playerId,
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

      // Delete socket from pool
      this.sockets.delete(socket);

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

          this.send(clientSocket, {
            type: 'UNPAIRED',
          });
        }
      }
    }
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
      }, 100);
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
      const clients = this.filterSocketsByMeta(
        (clientMeta) => clientMeta.client === true && clientMeta.accessCode === meta.accessCode
      );

      if (clients.length === 1) {
        return clients[0];
      } else if (clients.length > 1) {
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

  getSerializedInfo(socket) {
    const meta = this.getMeta(socket);

    if (meta) {
      return `[${meta.client ? 'client' : 'controller'}][${meta.name}][${meta.id}]`;
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

  get listMetaSafe() {
    return [...this.sockets.values()].map(this.__makeMetaSafe);
  }

  __makeMetaSafe = (meta) => {
    const safeMeta = { ...meta };

    privateMetaAttributes.forEach((attr) => {
      delete safeMeta[attr];
    });

    return safeMeta;
  };
}

export const sockets = new SocketsManager();
