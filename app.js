var http = require("http");
var createHandler = require("github-webhook-handler");

var config = require("./config");

var handler = createHandler({
  path: "/webhook",
  secret: config.github.webhookSecret
});

http.createServer(function (req, res) {
  console.log(req);
  handler(req, res, function (err) {
    res.statusCode = 404;
    res.end('no such location');
  });
}).listen(config.port, function() {
  console.log("Listening on port " + config.port + "!!!!!\n");
  console.log("===============================================");
});

handler.on("push", function(event) {
  console.log("Received webhook! Payload below =========================\n");
  console.log(event.payload);
});