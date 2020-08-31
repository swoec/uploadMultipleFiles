var express = require('express');
var app = express();
var fs = require("fs");
const path = require('path');
var bodyParser = require('body-parser');
var multer  = require('multer');


app.use(express.static(path.join(__dirname, 'assets')));
app.use(bodyParser.urlencoded({ extended: false }));
// store files in two directories for safety.directories:/home/alex/tmp,__dirname/files/
app.use(multer({ dest: '/home/alex/tmp/'}).array('fileUploader'));


app.get('/upload', function (req, res) {
   res.sendFile( __dirname + "/" + "index.html" );
})


app.post('/files',function (req, res) {

   var fname = req.query.filename;
   var resolution = req.query.resolution;

    req.files.forEach(function (file) {
        var des_file = __dirname + "/file/" + resolution + "/" + fname
        fs.readFile(file.path, function (err, data) {
            fs.writeFile(des_file, data, function (err) {
                if (err) {
                    console.log(err);
                    response = {
                        status: 500,
                        message: 'File uploaded fail',
                        filename: fname
                    };
                } else {
                    fullUrl = req.protocol + '://' + req.get('host') + "/file/" + resolution + "/" + fname;
                    response = {
                        status: 200,
                        message: 'File uploaded successfully',
                        filename: fullUrl
                    };
                }
                res.end(JSON.stringify(response));
            });
        });

    });
})

var server = app.listen(8081, function () {

  var host = server.address().address
  var port = server.address().port

  console.log("access link is  http://%s:%s", host, port)

})
