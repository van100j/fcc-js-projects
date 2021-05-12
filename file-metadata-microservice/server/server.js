const express = require("express");
const filesize = require("filesize");
const path = require('path');

const maxFileSize = 5 * 1024 * 1024;
const upload = require('multer')({
  limits: { fileSize: maxFileSize }
});

const app = express();

app.set('port', (process.env.PORT || 5000));
app.set('views', __dirname + '/views')
app.set('view engine', 'ejs');

console.log(path.join(__dirname, '../client'));

app.use('/static', express.static(path.join(__dirname, '../client')));

app.get('/', (req, res) => {
  res.render('index', {});
});

app.post('/api/filesize', upload.single('file'), (req, res) => {
  res.send({
    size: req.file.size,
    sizeHuman: filesize(req.file.size, {standard: "iec"}),
    filename: req.file.originalname
  });
});

//
// File size limit: http://stackoverflow.com/questions/34697502/how-to-limit-the-file-size-when-uploading-with-multer
//
app.use(function (err, req, res, next) {
  if(err.code === 'LIMIT_FILE_SIZE') {
    res.send({
      status: 0,
      error: "File too large! (max file size: " + filesize(maxFileSize, {standard: "iec"}) + ")"
    })
  } else {
    next(err);
  }
})



app.listen(app.get('port'), () => console.log('App listening on port ' + app.get('port')));
