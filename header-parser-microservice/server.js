const express=require("express");

const app = express();

app.set('port', (process.env.PORT || 5000));

app.get('/', (req, res) => {
    const language = req.headers["accept-language"].split(",")[0];
    const os = (req.headers["user-agent"].split(/[\(\)]/)[1]).trim();

    res.send({
      ip: getIP( req.headers['x-forwarded-for'] || req.connection.remoteAddress ),
      language,
      os
    });

});

function getIP(ip) {
  const isV6 = ip.indexOf(':') !== -1;

  return isV6 ? ip.split(':').reverse()[0] : ip;
}

app.listen(app.get('port'), () => console.log('App listening on port ' + app.get('port')));
