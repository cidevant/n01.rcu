import { execSync } from 'child_process';
import { sockets } from './sockets-manager.js';
import queryString from 'query-string';

app.get('/sockets', function (_req, res) {
  res.json({
    ok: true,
    sockets: sockets.listMetaSafe,
  });
});

config.scenes.forEach((scene) => {
  app.get(`/scene/${scene.name}`, (req, res) => {
    const cmd = `obs-cli --host ${config.host} --password ${config.obs.password} --port ${config.obs.port}`;
    const scoreValue = parseInt(scene.name, 10);

    try {
      console.log(`[web.server] scene: ${scene.name}, timeout: ${scene.timeout}`);

      // switch scenes
      execSync(`${cmd} scene switch ${scene.name}_scene`);
      setTimeout(() => {
        execSync(`${cmd} scene switch main_scene`);
      }, scene.timeout);

      // send score
      if (!isNaN(scoreValue)) {
        setTimeout(() => {
          sendScore(scoreValue, req);
        }, 1500);
      }

      res.json({ ok: true });
    } catch (error) {
      console.error(`[web.server] scene error: ${scene.name}`, error.message.toString());

      res.json({
        ok: false,
        error: error.message.toString(),
      });
    }
  });
});


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



export default {
    obs: {
      port: 4444,
      password: 'obs.controller.darts',
    },
    scenes: [
      {
        name: '26',
        timeout: 2000,
      },
      {
        name: '100',
        timeout: 2000,
      },
      {
        name: '007',
        timeout: 3000,
      },
      {
        name: '13',
        timeout: 3000,
      },
      {
        name: '27',
        timeout: 3000,
      },
      {
        name: '180',
        timeout: 2000,
      },
      {
        name: '33',
        timeout: 2000,
      },
      {
        name: 'nice',
        timeout: 4000,
      },
      {
        name: 'wow',
        timeout: 4000,
      },
      {
        name: 'gg',
        timeout: 4000,
      },
      {
        name: 'hello',
        timeout: 3500,
      },
      {
        name: 'bye',
        timeout: 3500,
      },
    ],
  };
  