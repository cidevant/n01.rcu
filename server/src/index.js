import { attachWebsocketServer } from './ws.server.js';
import { initWebServer } from './web.server.js';

const PORT = process.env.PORT || 3000;
const APP_PORT = process.env.APP_PORT || 3001;
const IS_PRODUCTION_ENV = process.env.NODE_ENV === 'production';

// Web server
const webServer = initWebServer(PORT, APP_PORT, IS_PRODUCTION_ENV);

// WebSockets Server
attachWebsocketServer(webServer);
