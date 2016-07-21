var rp = require("request-promise");

var Push = require("../models/push");
var createHandler = require("../config/webhookHandler");
var handler = createHandler({ path: "/", secret: "rodney"});

handler.on('push', function (event) {
  console.log('Received a push event for %s to %s',
    event.payload.repository.full_name,
    event.payload.ref);

  savePush(event);
  getTree(event);
  // function to extract tree id and use it to get tree from github api
  // function to create a new tree in the target directory (replacing existing tree?!)
});


function handleWebhook(req, res) {
  handler(req, res, function (err) {
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
  push.save(function(err, push) {
    if (err) console.log(err);
    console.log(push);
  });
}

function getTree(event) {
  var treeId = event.payload.head_commit.tree_id;

}

module.exports = { handleWebhook: handleWebhook };
