var Push = require("../models/push");
var createHandler = require("../config/webhookHandler");
var handler = createHandler({ path: "/", secret: "rodney"});

function create(req, res) {
  handler(req, res, function (err) {
    console.log(err);
  });
  return res.end("Webhook payload received!");
}

handler.on('push', function (event) {
  console.log('Received a push event for %s to %s',
    event.payload.repository.name,
    event.payload.ref);

  var push = new Push({
    eventId: event.id,
    timestamp: Date.now,
    repo: event.payload.repository.full_name,
    pusher: event.payload.pusher.name,
    payload: {
      ref: event.payload.ref,
      beforeSha: event.payload.before,
      afterSha: event.payload.after,
      diffUrl: event.payload.compare,
      headCommit: {
        id: event.payload.head_commit.id,
        treeId: event.payload.head_commit.tree_id,
        message: event.payload.head_commit.message,
        timestamp: event.payload.head_commit.timestamp
      }
    }
  });

  push.save(function(err, push) {
    if (err) return res.status(500).json(err);
    res.status(200).json(push);
  });
});

module.exports = { create: create };
