var rp = require("request-promise");
var config = require("../config/config");
var output = require("./output");
var createHandler = require("../config/webhookHandler");

var Push = require("../models/push");
var Tree = require("../models/tree");

var handler = createHandler({ path: "/", secret: "rodney"});

handler.on('push', function (event) {
  var payload = event.payload;
  var treeId = payload.head_commit.tree_id;
  var repo = payload.repository.full_name;

  console.log('\nReceived a push event from %s for %s', repo, treeId);

  savePush(event, payload);
  getTree(repo, treeId);
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

function getTree(repo, treeId) {
  var uri = "https://api.github.com/repos/" + repo + "/git/trees/" + treeId;
  var options = {
    uri: uri,
    headers: {
      'User-Agent': 'Request-Promise',
      'Authorization': "token " + config.github.apiKey
    },
    json: true
  };
  return rp(options)
    .then(function(data) {
      saveTree(data);
      output.updateRepo(data);
    })
    .catch(function(err) {
      return console.log(err);
    });
}

function saveTree(data) {
  data.tree = JSON.parse(data.tree);
  console.log("Neat data: " + data.tree);
  var tree = new Tree(data);
  return tree.save(function(err, tree) {
    if(err) console.log(err);
    console.log("\nTree saved: " + tree); 
  });
}

module.exports = { handle: handle };