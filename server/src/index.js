import { attachWebsocketServer } from './ws.server.js';
import { initWebServer } from './web.server.js';

const PORT = process.env.PORT || 3000;
const APP_PORT = process.env.APP_PORT || 3001;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Web server
const webServer = initWebServer(PORT, APP_PORT, NODE_ENV);

// WebSockets Server
attachWebsocketServer(webServer);
