import express from 'express';
import chalk from 'chalk';
import cors from 'cors';
import { sockets } from './sockets-manager.js';
import OBSWebSocket from 'obs-websocket-js';

let obsConnected = false;

const obs = new OBSWebSocket();

try {
  await obs.connect('ws://devant.cz:4444', undefined, { rpcVersion: 1 });

  obsConnected = true;

  console.log('[ws.obs] connected');
} catch (error) {
  console.log('[ws.obs] connection error', error);
}

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

  app.get('/sockets-list', function (req, res) {
    res.json({
      sockets: sockets.listMetaSafe,
    });
  });

  app.get('/set-scene', async function (req, res) {
    if (!obsConnected) {
      res.json({
        ok: false,
        error: 'not_connected_to_obs_websocket',
        message: 'Not connected to OBSWebSocket',
      });

      return;
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
        error: error.code,
        message: error.message,
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
