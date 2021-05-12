const dotenv = require('dotenv').config({
  path: process.env.NODE_ENV === 'test' ? 'test.env' :
    (process.env.NODE_ENV === 'production' ? 'production.env' : '.env')
});
const server = require('./server/index');
const app = require('./server/express');

server.on('request', app);

server.listen(process.env.PORT || 4040, () => {
  console.info(`server/ws started on port ${process.env.PORT}`); // eslint-disable-line no-console
});
