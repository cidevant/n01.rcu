import express from 'express';
import chalk from 'chalk';
import cors from 'cors';
import { sockets } from './sockets-manager.js';

/**
 * Web server
 */

export function initWebServer(port) {
  const app = express();

  app.use(express.static('static'));
  app.use(cors());

  app.get('/', function (_, res) {
    res.sendfile('static/index.html');
  });

  app.get('/is-alive', function (_req, res) {
    res.json({
      ok: true,
    });
  });

  app.get('/check-access-code', function (req, res) {
    const valid = sockets.isAccessCodeAvailable(req.params.accessCode);

    res.json({
      ok: valid,
    });
  });

  app.get('/sockets-list', function (_req, res) {
    res.json({
      sockets: sockets.listMetaSafe,
    });
  });

  app.get('/generate-access-code', function (_req, res) {
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

  return app.listen(port, async () => {
    console.log('[web.server] listening on port', chalk.greenBright(port));
  });
}
