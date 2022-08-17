import { handleActions } from './ws.handlers.js';
import { sockets } from './sockets-manager.js';
import { WebSocketServer } from 'ws';

/**
 * WebSocket server
 */

export function attachWebsocketServer(server) {
  const wsServer = new WebSocketServer({
    noServer: true,
    path: '/ws',
  });

  wsServer.on('connection', (ws, req) => {
    ws.on('message', (msg) => handleActions(msg, ws));
    ws.on('close', () => sockets.onClose(ws));
    sockets.onConnect(ws, req);
  });

  server.on('upgrade', (request, socket, head) => {
    wsServer.handleUpgrade(request, socket, head, (ws) => {
      wsServer.emit('connection', ws, request);
    });
  });
}
