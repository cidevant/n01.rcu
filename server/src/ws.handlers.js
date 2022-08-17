import { sockets } from './sockets-manager.js';
import chalk from 'chalk';

const actionHandlers = {
  inputScore: inputScoreHandler,
  scoreLeft: scoreLeftHandler,
  setFinishDart: setFinishDartHandler,
  getFinishDart: getFinishDartHandler,
};

export function handleActions(_message, ws) {
  const message = _message.toString();

  try {
    const jsonMessage = JSON.parse(message);
    const actionHandler = actionHandlers[jsonMessage['type']];

    if (actionHandler) {
      console.log(chalk.green('[ws.server][action]'), message, sockets.getSerializedInfo(ws));

      actionHandler(jsonMessage, ws);
    } else {
      console.error('[ws.server][action][error] not found', message, sockets.getSerializedInfo(ws));
    }
  } catch (error) {
    console.error('[ws.server][action][error]', error, message, sockets.getSerializedInfo(ws));
  }
}

/**
 * Controller only actions
 */

function inputScoreHandler(msg, ws) {
  if (sockets.isController(ws)) {
    const client = sockets.getPairedClient(ws);

    if (client) {
      sockets.send(client, {
        type: 'inputScore',
        value: msg['value'],
      });
    }
  } else {
    console.error('[ws.server][inputScore][error] action available only for controllers');
  }
}

function setFinishDartHandler(msg, ws) {
  if (sockets.isController(ws)) {
    const client = sockets.getPairedClient(ws);

    if (client) {
      sockets.send(client, {
        type: 'setFinishDart',
        value: msg['value'],
      });
    }
  } else {
    console.error(
      '[ws.server][setFinishDart][error] only for controllers',
      sockets.getSerializedInfo(ws)
    );
  }
}

/**
 * Client only actions
 */

function scoreLeftHandler(msg, ws) {
  if (sockets.isClient(ws)) {
    sockets.getPairedControllers(ws).forEach((target) => {
      sockets.send(target, {
        type: 'scoreLeft',
        value: msg['value'],
      });
    });
  } else {
    console.error(
      '[ws.server][scoreLeftHandler][error] available only for clients',
      sockets.getSerializedInfo(ws)
    );
  }
}

function getFinishDartHandler(msg, ws) {
  if (sockets.isClient(ws)) {
    sockets.getPairedControllers(ws).forEach((target) => {
      sockets.send(target, {
        type: 'getFinishDart',
        value: msg['value'],
      });
    });
  } else {
    console.error(
      '[ws.server][getFinishDartHandler][error] action available only for clients',
      sockets.getSerializedInfo(ws)
    );
  }
}
