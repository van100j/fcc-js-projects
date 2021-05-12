const express = require('express');
const compression = require('compression');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const cors = require('cors');
const routes = require('./routes');

const app = express();
app.use(compression());
app.use(cors());
// if (process.env.NODE_ENV === 'development') {
//   app.use(require('cors')());
// }

app.use(express.static('build'));

app.use(helmet());
app.use(bodyParser.json());

app.use('/api', routes);

module.exports = app;
