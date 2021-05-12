import "regenerator-runtime/runtime";
import config from './config/config';
import app from './config/express';
import wss from './config/websocket';
import server from './config/server';

server.on('request', app);

// module.parent check is required to support mocha watch
// src: https://github.com/mochajs/mocha/issues/1912
if (!module.parent) {
  server.listen(config.port, () => {
    console.info(`server/ws started on port ${config.port} (${config.env})`); // eslint-disable-line no-console
  });
}

export default server;
