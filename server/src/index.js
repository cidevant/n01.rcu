import { attachWebsocketServer } from './ws.server.js';
import { initWebServer } from './web.server.js';

const PORT = process.env.PORT || 3000;

// Web server
const webServer = initWebServer(PORT);

// WebSockets Server
attachWebsocketServer(webServer);
