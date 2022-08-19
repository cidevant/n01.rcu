import { sockets } from './sockets-manager.js';
import chalk from 'chalk';

const prefix = {
  controllers: 'CONTROLLERS:',
  client: 'CLIENT',
};

// custom actions
const serverActions = {};

export function handleActions(_message, ws) {
  const message = _message.toString();

  try {
    const jsonMessage = JSON.parse(message);
    const serverActionHandler = serverActions[jsonMessage['type']];

    if (serverActionHandler) {
      serverActionHandler(jsonMessage, ws);
    } else if (jsonMessage['type'].startsWith(prefix.controllers)) {
      controllersProxyHandler(jsonMessage, ws);
    } else if (jsonMessage['type'].startsWith(prefix.client)) {
      clientProxyHandler(jsonMessage, ws);
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
 * Resend message from controller to client
 */

function clientProxyHandler(msg, ws) {
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
}

/**
 * Resend message from client to controllers
 */

function controllersProxyHandler(msg, ws) {
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
}
