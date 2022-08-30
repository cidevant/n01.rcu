import { execSync } from 'child_process';
import { sockets } from './sockets-manager.js';
import config from '../config.js';
import express from 'express';
import queryString from 'query-string';

/**
 * Web server
 */
export function initWebServer() {
  const app = express();

  app.use(express.static('static'));

  app.get('/', function (_, res) {
    res.sendfile('static/index.html');
  });

  // app.get('/sockets', function (_req, res) {
  //   res.json({
  //     ok: true,
  //     sockets: sockets.listMetaSafe,
  //   });
  // });

  // config.scenes.forEach((scene) => {
  //   app.get(`/scene/${scene.name}`, (req, res) => {
  //     const cmd = `obs-cli --host ${config.host} --password ${config.obs.password} --port ${config.obs.port}`;
  //     const scoreValue = parseInt(scene.name, 10);
  //
  //     try {
  //       console.log(`[web.server] scene: ${scene.name}, timeout: ${scene.timeout}`);
  //
  //       // switch scenes
  //       execSync(`${cmd} scene switch ${scene.name}_scene`);
  //       setTimeout(() => {
  //         execSync(`${cmd} scene switch main_scene`);
  //       }, scene.timeout);
  //
  //       // send score
  //       if (!isNaN(scoreValue)) {
  //         setTimeout(() => {
  //           sendScore(scoreValue, req);
  //         }, 1500);
  //       }
  //
  //       res.json({ ok: true });
  //     } catch (error) {
  //       console.error(`[web.server] scene error: ${scene.name}`, error.message.toString());
  //
  //       res.json({
  //         ok: false,
  //         error: error.message.toString(),
  //       });
  //     }
  //   });
  // });

  app.get('*', function (req, res) {
    console.error('[web.server] error: route not found', req.params);

    res.json({
      ok: false,
      error: `route not found: ${JSON.stringify(req.params)}`,
    });
  });

  return app.listen(config.web.port, () => {
    console.log(`[web.server] ${config.web.protocol}://${config.host}:${config.web.port}`);
    console.log(
      `[n01.obs.ws.server] ${config.websocket.protocol}://${config.host}:${config.web.port}/ws`
    );
  });
}

function sendScore(score, request) {
  const [, params] = request.url.split('?') ?? [];
  const connectionInfo = queryString.parse(params);

  if (!connectionInfo.accessCode) {
    console.error('[web.server][sendScore][error] missing accessCode');

    return;
  }

  const pairedControllers = sockets.filterSocketsByMeta(
    (meta) => meta.client && meta.accessCode === connectionInfo.accessCode && meta.pair !== null
  );

  if (pairedControllers.length === 1) {
    sockets.send(pairedControllers[0], {
      type: 'SET_INPUT_SCORE',
      payload: score,
    });
  } else if (pairedControllers.length > 1) {
    console.error(
      `[web.server][sendScore][error] several clients associated with controller (paired controllers: ${pairedControllers})`
    );
  } else {
    console.error(`[web.server][sendScore][error] no clients found for ${connectionInfo}`);
  }
}
