import { sockets } from './sockets-manager.js';
import chalk from 'chalk';

const handlers = {
  server: {},
  proxy: {
    client(msg, ws) {
      if (sockets.isController(ws)) {
        const type = msg['type'].replace('CLIENT:', '');
        const client = sockets.getPairedClient(ws);

        if (client) {
          sockets.send(client, {
            type,
            payload: msg['payload'],
          });
        }
      } else {
        console.error(
          chalk.red(`[ws.server][${msg['type']}][error] sender must be controller`),
          sockets.getSerializedInfo(ws)
        );
      }
    },
    controllers(msg, ws) {
      if (sockets.isClient(ws)) {
        const type = msg['type'].replace('CONTROLLERS:', '');

        sockets.getPairedControllers(ws).forEach((target) => {
          sockets.send(target, {
            type,
            payload: msg['payload'],
          });
        });
      } else {
        console.error(
          chalk.red(`[ws.server][${msg['type']}][error] sender must be client`),
          sockets.getSerializedInfo(ws)
        );
      }
    },
  },
};

export function handleActions(_message, ws) {
  const message = _message.toString();

  // when received `pong` message:
  //    * set `isAlive: true` to socket
  //    * stop further processing of incoming message
  if (handlePingPong.handleMessage(ws, message)) {
    return;
  }

  try {
    const jsonMessage = JSON.parse(message);
    const serverHandler = handlers.server[jsonMessage?.['type']];

    console.log(
      chalk.blueBright('[ws.server][action]'),
      jsonMessage['type'],
      sockets.getSerializedInfo(ws)
    );

    if (serverHandler) {
      serverHandler(jsonMessage, ws);
    } else if (jsonMessage['type'].startsWith('CONTROLLERS:')) {
      handlers.proxy.controllers(jsonMessage, ws);
    } else if (jsonMessage['type'].startsWith('CLIENT:')) {
      handlers.proxy.client(jsonMessage, ws);
    } else {
      throw 'not found';
    }
  } catch (error) {
    console.error(
      chalk.red('[ws.server][action][error]'),
      error,
      message,
      sockets.getSerializedInfo(ws)
    );
  }
}

/**
 * PING-PONG
 *
 * Every socket connected to server must implement "ping-pong" functionality:
 *    1) Server sends "ping" message (interval `connectionTimeout`) and marks socket as "dead".
 *    2) If socket responds with "pong" message it will be marked as "alive"
 *    3) All "dead" sockets are terminated by server (interval `connectionTimeout`)
 */

export const handlePingPong = {
  __connectionTimeout: 5000,
  __pingPongIntervalID: null,

  handleMessage(ws, message) {
    if (message === 'pong') {
      ws.isAlive = true;

      return true;
    }

    return false;
  },

  start(wss) {
    console.log('[ws.server][ping-pong] started');

    this.__pingPongIntervalID = setInterval(() => {
      wss.clients.forEach((ws) => {
        // closes "dead" socket
        if (!ws.isAlive) {
          console.log('[ws.server][ping-pong] closing dead sockets', sockets.getMetaSafe(ws));

          ws.close(4054, 'connection timeout (ping-pong, server)');

          return;
        }

        /**
         * 1. mark socket as `dead`
         * 2. send `ping` request to socket
         * 3. wait for socket `pong` response to mark it `alive`
         */
        ws.isAlive = false;
        ws.send('ping');
      });
    }, this.__connectionTimeout);
  },

  stop() {
    console.log('[ws.server][ping-pong] stopped');

    if (this.__pingPongIntervalID != null) {
      clearInterval(this.__pingPongIntervalID);

      this.__pingPongIntervalID = null;
    }
  },
};
