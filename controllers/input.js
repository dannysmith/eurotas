var rp = require("request-promise");
var util = require("util");
var exec = require("child_process").exec;
var child;

var config = require("../config/config");
var output = require("./output");
var createHandler = require("../config/webhookHandler");

var repo1 = config.github.origin.split("/")[1];
var repo2 = config.github.destination.split("/")[1];
var temp = "temp" + Date.now().toString();

var Push = require("../models/push");
var Tree = require("../models/tree");

var handler = createHandler({ path: "/", secret: "rodney"});

handler.on('push', function (event) {
  var payload = event.payload;
  var treeId = payload.head_commit.tree_id;
  var repo = payload.repository.full_name;
  console.log('\nReceived a push event from %s for %s', repo, treeId);
  savePush(event, payload);
  return runBash();
  // getTree(repo, treeId);
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

function runBash() {
  console.log("repo1: " + repo1);
  console.log("fullrepo1: " + config.github.origin);
  console.log("repo2: " + repo2);
  console.log("fullrepo2: " + config.github.destination);
  console.log("temp: " + temp);

  var bashScript = "mkdir " + temp + " && " + 
                   " cd " + temp + " &&" + 
                   " git clone git@github.com:" + config.github.origin + ".git &&" + 
                   " cd " + repo1 + " &&" +
                   " git remote rm origin &&" +
                   " mkdir imported &&" +
                   " mv *[^imported] imported &&" +
                   " git add . &&" + 
                   " git commit -m 'committed first repo changes' &&" +
                   " cd .. &&" +
                   " git clone git@github.com:" + config.github.destination + ".git &&" +
                   " cd " + repo2 + " &&" +
                   " git remote add imports ../" + repo1 + " &&" +
                   " git pull imports master &&" + 
                   " git push origin master &&" +
                   " cd .. &&" +
                   " cd .. &&" +
                   " rm -rf " + temp;
  child = exec(bashScript, function (error, output, error) { 
    console.log('output: ' + output);
    if (error !== null) console.log('exec error: ' + error);
  });
}






// function getTree(repo, treeId) {
//   var uri = "https://api.github.com/repos/" + repo + "/git/trees/" + treeId;
//   var options = {
//     uri: uri,
//     headers: {
//       'User-Agent': 'Request-Promise',
//       'Authorization': "token " + config.github.apiKey
//     },
//     json: true
//   };
//   return rp(options)
//     .then(function(data) {
//       return saveTree(data);
//     })
//     .catch(function(err) {
//       return console.log(err);
//     });
// }

// function saveTree(data) {
//   var tree = new Tree(data);
//   return tree.save(function(err, tree) {
//     if(err) console.log(err);
//     console.log("\nTree saved: " + tree); 
//     return output.parseTree(tree.tree);
//   });
// }



module.exports = { handle: handle };