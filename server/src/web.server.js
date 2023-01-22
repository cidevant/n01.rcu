import express from 'express';
import chalk from 'chalk';
import cors from 'cors';
import { sockets } from './sockets-manager.js';
import { obs, obsConnect, obsConnected, obsDisconnect } from './ws.obs.js';

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

  app.get('/obs-status', function (_req, res) {
    res.json({
      obsConnected,
    });
  });

  app.get('/obs-disconnect', async function (_req, res) {
    const result = await obsDisconnect();

    if (result === true) {
      res.json({
        ok: true,
        obsConnected,
      });
    } else {
      res.json({
        ok: false,
        obsConnected,
        error: result,
      });
    }
  });

  app.get('/obs-connect', async function (_req, res) {
    const result = await obsConnect();

    if (result === true) {
      res.json({
        ok: true,
        obsConnected,
      });
    } else {
      res.json({
        ok: false,
        obsConnected,
        error: result,
      });
    }
  });

  app.get('/set-scene', async function (req, res) {
    if (!obsConnected) {
      const result = await obsConnect();

      if (result !== true) {
        res.json({
          ok: false,
          obsConnected,
          error: result,
        });

        return;
      }
    }

    try {
      await obs.call('SetCurrentProgramScene', { sceneName: req.query.scene });

      setTimeout(() => {
        obs.call('SetCurrentProgramScene', { sceneName: 'main_scene' });
      }, 2000);

      res.json({
        ok: true,
      });
    } catch (error) {
      res.json({
        ok: false,
        obsConnected,
        error: error?.message ?? error,
      });
    }
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
