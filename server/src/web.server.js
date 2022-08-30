import express from 'express';
import chalk from 'chalk';

/**
 * Web server
 */

export function initWebServer(port) {
  const app = express();

  app.use(express.static('static'));

  app.get('/', function (_, res) {
    res.sendfile('static/index.html');
  });

  return app.listen(port, () => {
    console.log('[web.server] listening on port', chalk.greenBright(port));
  });
}
