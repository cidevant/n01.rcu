import { attachWebsocketServer } from './ws.server.js';
import { initWebServer } from './web.server.js';

// Run Web server
const server = initWebServer();

// Attach WebSockets server
attachWebsocketServer(server);
