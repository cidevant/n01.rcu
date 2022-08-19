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

  console.log(chalk.blueBright('[ws.server][action]'), message, sockets.getSerializedInfo(ws));

  try {
    const jsonMessage = JSON.parse(message);
    const serverHandler = handlers.server[jsonMessage['type']];

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
