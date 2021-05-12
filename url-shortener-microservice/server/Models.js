const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UrlSchema = Schema({
  url: String,
  inc: Number,
  handle: String
});

module.exports = mongoose.model('urls', UrlSchema);
