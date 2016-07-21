var Push = require("../models/push");
var createHandler = require("../config/webhookHandler");
var handler = createHandler({ path: "/", secret: "rodney"});

function create(req, res) {
  handler(req, res, function (err) {
    console.log(err);
  });
}

handler.on('push', function (event) {
  console.log('Received a push event for %s to %s',
    event.payload.repository.full_name,
    event.payload.ref);
  
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
});

module.exports = { create: create };
