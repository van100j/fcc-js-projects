const dotenv = require("dotenv").config();
const express = require("express");
const app = express();
const Base62 = require('base62');
const mongoose = require('mongoose')
        .connect(process.env.MONGOLAB_URI)
        .Promise = global.Promise;

const Url = require('./Models');
const validUrl = require('valid-url');

app.set('port', (process.env.PORT || 5000));
app.set('views', __dirname + '/views')
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.render('index', {});
});

app.get('/api/*', (req, res) => {
  //const saveUrl = "http" + (req.params[0] ? "s" : "") + "://" + req.params.url;
  const saveUrl = req.params[0];

  if(validUrl.isUri(saveUrl) || validUrl.isUri("http://" + saveUrl)) {  // allow saving "google.com"-like URLs

    const lastSaved = Url.findOne().sort('-inc').select("inc").exec();
    const urlExists = Url.findOne({url: saveUrl}).select("inc handle url").exec();

    Promise.all([urlExists, lastSaved])
      .then((values) => {

        const [exists, ls] = values;

        if(exists) { // already exists
          res.send({
            handle: exists.handle,
            url: exists.url,
            status: 1
          });
        } else { // save it

          const newInc = ls ? (ls.inc ? ls.inc + 1 : 1) : 1;
          const u = new Url({
            url: saveUrl,
            inc: newInc,
            handle: Base62.encode(newInc)
          });
          u.save().then((url) => {

            res.send({
              url: url.url,
              handle: url.handle,
              status: 1
            })
          }).catch((err) => {
            res.send({
              status: 0,
              error: 'There was an error while shortening your URL!'
            });

          });
        }

      })
      .catch(err => {
        res.send({
          status: 0,
          error: 'There was an error while shortening your url!'
        });
      });
    } else {
      res.send({
        status: 0,
        error: 'Invalid URL!'
      });
    }
});

app.get('/:handle', (req, res) => {
  Url.findOne({handle: req.params.handle})
     .select("url")
     .exec()
      .then(url => url ?
        res.redirect( (!(/^http/ig).test(url.url) ? 'http://' : '') + url.url) :
        res.send("<p>Invalid URL!")
      )
      .catch(err => res.send("<p>Invalid Request!"))
});

app.listen(app.get('port'), () => console.log('App listening on port ' + app.get('port')));

module.exports = app;
