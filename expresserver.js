var express = require('express');
var app = express();
var fs = require("fs");
const path = require('path');
var db = require('./db.js');
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

   console.log(JSON.stringify(req.query));

   var fname = req.query.filename;
   var username =req.query.name;
   var token = req.query.token;

   // check the priviledge in DB
   var sql = " SELECT token as token FROM user WHERE username = '" + username +"'";
   db.query(sql,function(err,rows){
          if(err){
              console.log(err);
              response = {
                  message: "System error! please wait a moment to recover!"
              };
              res.end(JSON.stringify(response));
          }

          if(rows != null &&rows !="" && typeof rows != "undefined"&&rows[0].token == token){
           // have the priviledge,continue
              var des_file = __dirname + "/file/" + fname
              fs.readFile( req.files[0].path, function (err, data) {
                  fs.writeFile(des_file, data, function (err) {
                      if( err ){
                          console.log( err );
                          response = {
                              message: 'File uploaded fail',
                              filename: fname
                          };
                      }else{
                          response = {
                              success:1,
                              message:'File uploaded successfully',
                              filename:fname
                          };
                      }
                      console.log( response );
                      res.end( JSON.stringify( response ) );
                  });
              });
          }else{
              response = {
                  message: "Upload Fail,Lack of priviledge."
              };
              res.end(JSON.stringify(response));
          }
   });
})

app.get('/files/:id',function(req,res){
        var id = req.params.id;
        res.sendFile(__dirname+"/files/"+id);
})
 
var server = app.listen(8081, function () {
 
  var host = server.address().address
  var port = server.address().port
 
  console.log("access link is  http://%s:%s", host, port)
 
})
