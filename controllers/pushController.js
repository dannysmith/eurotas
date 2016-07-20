var Push = require("../models/push");
var createHandler = require("../config/webhookHandler");
var handler = createHandler({ path: "/", secret: "rodney"});

function create(req, res) {
  console.log("request happening =============================");

  handler(req, res, function (err) {
    console.log(err);
  });

  return res.end("Webhook payload received!");
}

module.exports = { create: create };

handler.on('push', function (event) {
  console.log("push detected =================================");
  console.log('Received a push event for %s to %s',
    event.payload.repository.name,
    event.payload.ref);
});