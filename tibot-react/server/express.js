const express = require('express');
const compression = require('compression');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const routes = require('./routes');

const app = express();
app.use(compression());
app.use(express.static('build'));

app.use(helmet());
app.use(bodyParser.json());

app.use('/api', routes);

module.exports = app;
