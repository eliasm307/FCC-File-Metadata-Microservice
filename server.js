'use strict';

var express = require('express');
var cors = require('cors');  
var multer  = require('multer')

var upload = multer({ dest: 'uploads/' }).single('upfile')

var app = express();

const SPACER = "-------------------------------------------------"
console.clear();

app.use(cors());
app.use('/public', express.static(process.cwd() + '/public'));

// log all requests
app.use((req, res, next) => {
  console.log(SPACER);
  console.log(req.method + " " + req.path + " - " + req.ip);

  if(req.method === 'POST') console.log("req.body:", req.body)
  console.log("request details:", {reqQuery: req.query, reqParams: req.params});
 
  console.log(SPACER);
  next();
});

app.get('/', function (req, res) {
     res.sendFile(process.cwd() + '/views/index.html');
  });
 

app.post('/api/fileanalyse', function (req, res) {
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred when uploading.
      console.error("Multer error:", {err});
      return next(err);

    } else if (err) {
      // An unknown error occurred when uploading.
      console.error("General error:", {err});
      return next(err);
    }

    // Everything went fine.
    console.log("Upload success", {file: req.file});
    return res.json({name: req.file.originalname, type: req.file.mimetype, size: req.file.size});
  })
})

const listener = app.listen(process.env.PORT || 3000, function () {
  console.log('Node.js listening on port:', listener.address().port);
});
