var rp = require("request-promise");
var util = require("util");
var exec = require("child_process").exec;
var child;

var config = require("../config/config");
var createHandler = require("../config/webhookHandler");

var Push = require("../models/push");

var handler = createHandler({ path: "/", secret: "rodney"});

handler.on('push', function (event) {
  var payload = event.payload;
  var treeId = payload.head_commit.tree_id;
  var repo = payload.repository.full_name;
  var message = event.payload.head_commit.message;
  console.log("\n" + message + "\n");
  savePush(event, payload);
  return runBash(repo, message);
});

function handle(req, res) {
  return handler(req, res, function (err) {
    console.log(err);
  });
}

function savePush(event, payload) {
  var push = new Push({
    eventId: event.id,
    timestamp: Date.now(),
    repo: payload.repository.full_name,
    pusher: payload.pusher.name,
    payload: {
      ref: payload.ref,
      beforeSha: payload.before,
      afterSha: payload.after,
      diffUrl: payload.compare,
      headCommit: {
        id: payload.head_commit.id,
        treeId: payload.head_commit.tree_id,
        message: payload.head_commit.message,
        timestamp: payload.head_commit.timestamp
      }
    }
  });
  return push.save(function(err, push) {
    if (err) console.log(err);
    console.log(push);
  });
}

function runBash(origin, message) {
  var repo1 = origin.split("/")[1];
  var repo2 = config.github.destination.split("/")[1];
  var username = config.github.username;
  var password = config.github.password;
  var userPass = username + ":" + password;
  var dest = config.github.destination;
  var temp = "temp" + Date.now().toString();

  var bashScript = "mkdir " + temp + " &&" + 
                   " cd " + temp + " &&" + 
                   ' git config --global user.email "odholden@gmail.com"' +
                   ' git config --global user.name "Oliver Holden"' +
                   " git clone https://" + userPass + "@github.com/" + origin + ".git &&" + 
                   " cd " + repo1 + " &&" +
                   " git remote rm origin &&" +
                   " mkdir imported &&" +
                   " mv * imported || true &&" +
                   " git add . &&" + 
                   " git commit -m '" + message + "' &&" +
                   " cd .. &&" +
                   " git clone https://" + userPass + "@github.com/" + dest + ".git &&" +
                   " rm -rf "+ repo2 +"/* &&" +
                   " cp -R " + repo1 + "/* " + repo2 + " &&" +
                   " cd " + repo2 + " &&" +
                   " git add -A &&" +
                   " git commit -m '" + message + "' &&" +
                   ' echo "machine github.com login ' + username + ' password ' + password + '" >> ~/.netrc &&' +
                   " git push https://" + userPass + "@github.com/" + dest + ".git --all" +
                   " cd .. &&" +
                   " cd .. &&" +
                   " rm -rf " + temp;
  child = exec(bashScript, function (stderr, output, error) { 
    console.log('output: ' + output);
    if (error !== null) console.log('exec error: ' + error);
    console.log("=========================================");
  });
}

function landingPage(req, res) {
  res.send({ message: "This app is designed for a POST request only."});
}

module.exports = { 
  handle: handle,
  landingPage: landingPage
};