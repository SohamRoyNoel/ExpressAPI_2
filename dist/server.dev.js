"use strict";

var express = require('express');

var dotenv = require('dotenv');

var morgan = require('morgan');

var connectDB = require('./config/db');

var errorHandler = require("./middleware/error"); // File upload


var fileUpload = require('express-fileupload'); // Path module


var path = require('path'); // Route Files


var bootcamps = require('./routes/bootcamps');

var courses = require('./routes/courses');

var auth = require('./routes/auth'); // Middleware


var logger = require('./middleware/logger'); // ENV variables


dotenv.config({
  path: './config/config.env'
}); // Connect Database

connectDB();
var app = express(); // Body Parser : used to handel request from outside:: without this we will get undefined on console

app.use(express.json()); // File Upload middleware

app.use(fileUpload()); // File upload static path

app.use(express["static"](path.join(__dirname, 'public'))); // Mount Middleware 
//app.use(logger);
// Dev logging Middleware

if (process.env.NODE_ENV === 'developmemt') {
  // console.log('Api : ' + process.env.GEOCODER_API_KEY);
  app.use(morgan()); // ::1 - - [Sat, 26 Sep 2020 06:53:29 GMT] "PUT /api/v1/bootcamps/1656 HTTP/1.1" 200 55 "-" "PostmanRuntime/7.26.4"
} // Mount Routers


app.use('/api/v1/bootcamps', bootcamps);
app.use('/api/v1/courses', courses);
app.use('/api/v1/auth', auth); // Custom error handler : middleware concept

app.use(errorHandler);
var PORT = process.env.PORT || 5000;
var server = app.listen(PORT, function () {
  console.log('App listening on port ${PORT} ${process.env.NODE_ENV}');
}); // Handle unhandled promise rejections

process.on('unhandledRejection', function (err, promise) {
  console.log("Unhandled Rejection: ".concat(err.message)); // Close Server

  server.close(function () {
    return process.exit(1);
  });
});