const compression = require('compression');
const express = require("express");
const path = require("path");
const fs = require("fs");
const request = require("request");
const imgurAPISearchUrl = 'https://api.imgur.com/3/gallery/search/top/0/'; // + sort + '/' + page + '/?q=' + query
const imgurClientID = process.env.IMGUR_CLIENT_ID;
const app = express();

const recentFilename = __dirname + "/data/recent.json";

const resultsPerPage = 10;

app.set('port', (process.env.PORT || 5000));
app.set('views', __dirname + '/views')
app.set('view engine', 'ejs');

//
// Heroku: https://rocky-plateau-99907.herokuapp.com/
// nodemon --ignore 'client/dist/*.js
//

app.use(compression());
app.use('/static', express.static(path.join(__dirname, '../client')));

app.get('/', (req, res) => {
  res.render('index', {});
});

app.get('/api/search/:query', (req, res) => {

  const offset = +(req.query.offset || 0);
  const query = req.params.query;


  fs.readFile(recentFilename, 'utf8', (err, data) => makeRequest(err ? {recent: []} : JSON.parse(data)));

  function makeRequest(r) {

    request({
      url: imgurAPISearchUrl + "?q=" + query,
      headers: { 'Authorization': 'Client-ID ' + imgurClientID }
    }, (error, response, body) => {
      if (!error && response.statusCode == 200) {

        const results = JSON.parse(body).data;
        const recent = [
            {search: query.trim(), timestamp: (new Date()).toISOString()},
            ...r.recent.filter(item => item.search.trim() !== query.trim())
          ].slice(0, 10);

        const sendResponse = {
          status: true,
          total: Math.ceil(results.length / resultsPerPage),
          offset: +offset,
          data: results.slice(offset * resultsPerPage, offset * resultsPerPage + resultsPerPage),
          recent: recent,
        };

        fs.writeFile(
          recentFilename,
          JSON.stringify({recent: recent}),
          'utf8',
          (err) => res.send(sendResponse)
        );

      } else {
        res.send({status: false, error: error});
      }
    });
  }
});

app.get('/api/recent-search', (req, res) => {
  fs.readFile(recentFilename, 'utf8', (err, data) => {
    if(!err) {
      res.send(JSON.parse(data));
    } else {
      res.send({recent: []});
    }
  })
});

app.listen(app.get('port'), () => console.log('App listening on port ' + app.get('port')));
