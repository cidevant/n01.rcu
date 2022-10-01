import { handleActions, handlePingPong } from './ws.handlers.js';
import { sockets } from './sockets-manager.js';
import { WebSocketServer } from 'ws';
import chalk from 'chalk';

/**
 * WebSocket server with ping/pong
 */

export function attachWebsocketServer(server) {
  // create server
  const wss = new WebSocketServer({
    noServer: true,
    path: '/ws',
  });

  // setup handlers
  wss.on('connection', (ws, req) => {
    sockets.onConnect(ws, req);
    ws.on('message', (msg) => handleActions(msg, ws));
    ws.on('close', () => sockets.onClose(ws));
  });

  // setup `ping-pong`
  handlePingPong.start(wss);
  wss.on('close', () => {
    handlePingPong.stop();
  });

  // attach websocket server to web server
  server.on('upgrade', (request, socket, head) => {
    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit('connection', ws, request);
    });
  });

  console.log('[ws.server] listening on path', chalk.greenBright('/ws'));
}
