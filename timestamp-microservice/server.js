var express = require('express');
var moment = require('moment');

var app = express();

app.set('port', (process.env.PORT || 5000));

app.get('/', function(req, res) {
    var host = req.get('host');
    res.send(
      ['<body>',
        '<h1>Timestamp Microservice</h1>',
        '<p>Usage: ', host, '/[ TIMESTAMP | DATE ]', '</p>',
        '<h4>Examples:</h4>',
        '<p><code><a href="/January 1, 2017">', host, '/January 1, 2017</a></code></p>',
        '<p><code><a href="/1483225200">', host, '/1483225200</a></code></p>',
      '</body>'].join('')
      );
});

app.get('/:date', function(req, res) {
    var timedate;
    if ((parseInt(req.params.date)).toString() == req.params.date) {
        timedate = moment.unix(parseInt(req.params.date));
    } else {
        timedate = moment(req.params.date);
    }

    res.send({
        unix: timedate.isValid()
            ? Math.round(timedate.format('X'))
            : null,
        natural: timedate.isValid()
            ? timedate.format('MMMM DD, YYYY')
            : null
    });
});

app.listen(app.get('port'), function() {
    console.log('App listening on port ' + app.get('port'));
});
