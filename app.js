// External requirements
var express = require("express");
var mongoose = require("mongoose");
var rp = require("request-promise");
var util = require("util");
var exec = require("child_process").exec;
var child;

// Initialize app
var app = express();

// Internal requirements
var config = require("./config/config");
var createHandler = require("./config/webhookHandler");

// Router
var router = express.Router();
router.get('/', landingPage);
router.post('/', handle);
app.use('/', router);

// App listens on port
app.listen(config.port, function() {
  console.log("Listening on " + config.port);
  console.log("===============================================");
});

// Webhook handler
var handler = createHandler({ path: "/", secret: "rodney"});

handler.on('push', function (event) {
  var repo = event.payload.repository.full_name;
  var message = event.payload.head_commit.message;
  console.log("\n" + message + "\n");
  return runBash(repo, message);
});

function handle(req, res) {
  return handler(req, res, function (err) {
    console.log(err);
  });
}

// Bash command for heroku
function runBash(origin, message) {
  var repo1 = origin.split("/")[1];
  var repo2 = config.github.destination.split("/")[1];
  var username = config.github.username;
  var password = config.github.password;
  var email = config.github.email;
  var name = config.github.name;
  var dest = config.github.destination;
  var filePath = config.github.filePath;
  var userPass = username + ":" + password;
  var temp = "temp" + Date.now().toString();

  var bashScript = "mkdir " + temp + " &&" + 
                   " cd " + temp + " &&" + 
                   " git clone https://" + userPass + "@github.com/" + origin + ".git &&" + 
                   " cd " + repo1 + " &&" +
                   ' git config user.email "' + email + '" &&' +
                   ' git config user.name "' + name + '" &&' +
                   " git remote rm origin &&" + parseFilePath(filePath) +
                   " git add . &&" + 
                   " git commit -m '" + message + "' &&" +
                   " cd .. &&" +
                   " git clone https://" + userPass + "@github.com/" + dest + ".git &&" +
                   " rm -rf "+ repo2 +"/* &&" +
                   " cp -R " + repo1 + "/* " + repo2 + " &&" +
                   " cd " + repo2 + " &&" +
                   ' git config user.email "' + email + '" &&' +
                   ' git config user.name "' + name + '" &&' +
                   " git add -A &&" +
                   " git commit -m '" + message + "' &&" +
                   ' echo "machine github.com login ' + username + ' password ' + password + '" >> ~/.netrc &&' +
                   " git push origin &&" +
                   " cd .. &&" +
                   " cd .. &&" +
                   " rm -rf " + temp;
  child = exec(bashScript, function (stderr, output, error) { 
    console.log('output: ' + output);
    console.log('stderr:' + stderr);
    if (error !== null) console.log('exec error: ' + error);
    console.log("=========================================");
  });
}

function parseFilePath(filePath) {
  var dirs = filePath.split("/");
  var array = [];
  for (var i = 0; i < dirs.length; i++) {
    if (i > 0) {
      var currentPath = [];
      for (var j = i; j >= 0; j--) {
        currentPath.unshift(dirs[j] + "/")
      }
      array.push("mkdir " + currentPath.join("") + " && ")
    } else {
      array.push("mkdir " + dirs[i] + " && ");
    }
  }
  var string = array.join(" ");
  return string + "mv * " + currentPath.join("") + " && "; 
}

// Landing page for GET request
function landingPage(req, res) {
  res.send({ message: "This app is designed for a POST request only."});
}