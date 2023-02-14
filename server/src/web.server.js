import express from 'express';
import chalk from 'chalk';
import cors from 'cors';
import { sockets } from './sockets-manager.js';

/**
 * Web server
 */

export function initWebServer(port, appPort, nodeEnv) {
  // SERVER

  const server = express();

  server.use(cors());
  server.use(express.static('static'));
  server.get('/', function (_, res) {
    res.sendfile('static/index.html');
  });
  server.get('/is-alive', function (_req, res) {
    res.json({
      ok: true,
    });
  });
  server.get('/check-access-code', function (req, res) {
    const valid = sockets.isAccessCodeAvailable(req.params.accessCode);

    res.json({
      ok: valid,
    });
  });
  server.get('/sockets-list', function (_req, res) {
    res.json({
      sockets: sockets.listMetaSafe,
    });
  });
  server.get('/generate-access-code', function (_req, res) {
    const accessCode = sockets.generateAccessCode();

    if (accessCode) {
      res.json({
        ok: true,
        code: accessCode,
      });
    } else {
      res.json({
        ok: false,
        error: 'max tries exceeded',
        code: null,
      });
    }
  });

  // APP SERVER

  const app = express();
  const appPath = nodeEnv === 'development' ? '../app/build' : 'app';

  app.use(cors());
  app.use(express.static('app'));
  app.get('/', function (_, res) {
    res.sendfile('app/index.html');
  });

  // RUN

  return server.listen(port, async () => {
    console.log('[web.server] listening on port', chalk.greenBright(port));

    app.listen(appPort, async () => {
      console.log('[web.app] listening on port', chalk.greenBright(appPort));
    });
  });
}
