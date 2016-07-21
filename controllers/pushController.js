var rp = require("request-promise");

var config = require("../config/config");
var Push = require("../models/push");
var createHandler = require("../config/webhookHandler");
var handler = createHandler({ path: "/", secret: "rodney"});

handler.on('push', function (event) {
  console.log('Received a push event for %s to %s',
    event.payload.repository.full_name,
    event.payload.ref);

  savePush(event);
  getTree(event);
  // function to create a new tree in the target directory (replacing existing tree?!)
});


function handleWebhook(req, res) {
  return handler(req, res, function (err) {
    console.log(err);
  });
}

function savePush(event) {
  var payload = event.payload;
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

function getTree(event) {
  var treeId = event.payload.head_commit.tree_id;
  var repo = event.payload.repository.full_name;
  console.log("\n=================================\n");
  console.log("Tree id: " + treeId);
  console.log("\n=================================\n");
  console.log("Repo: " + repo);
  console.log("\n=================================\n");

  var uri = "https://api.github.com/repos/" + repo + "/git/trees/" + treeId;

  var options = {
      uri: uri,
      qs: {
          access_token: 'xxxxx xxxxx' // -> uri + '?access_token=xxxxx%20xxxxx' 
      },
      headers: {
          'User-Agent': 'Request-Promise',
          'username': ""
      },
      json: true // Automatically parses the JSON string in the response 
  };

  return rp(url)
    .then(function(data) {
      return console.log("returned from the github api: " + data);
    })
    .catch(function(err) {
      return console.log(err);
    });
}

module.exports = { handleWebhook: handleWebhook };