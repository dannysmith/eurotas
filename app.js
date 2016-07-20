var express = require("express");
var mongoose = require("mongoose");

var config = require("./config/config");
var router = require("./config/router");

var app = express();

mongoose.connect(config.database);

app.use('/', router);

app.listen(config.port, function() {
  console.log("Listening on " + config.port);
  console.log("===============================================");
});

