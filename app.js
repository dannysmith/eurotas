// var http = require("http");
// var createHandler = require("github-webhook-handler");

// var config = require("./config");

// var handler = createHandler({
//   path: "/",
//   secret: ""
// });

// http.createServer(function (req, res) {
//   console.log(req);
//   handler(req, res, function (err) {
//     res.statusCode = 404;
//     res.end('no such location');
//   });
// }).listen(config.port, function() {
//   console.log("Listening on port " + config.port + "!!!!!\n");
//   console.log("===============================================");
// });

// handler.on("push", function(event) {
//   console.log("Received webhook! Payload below =========================\n");
//   console.log(event.payload);
// });

var gith = require("gith").create(3000);

gith({
  repo: "odholden/eurotas-test"
}).on("all", function(payload) {
  console.log("===============================================");
  var log = (payload.branch === "master") ? payload : "incorrect branch!";
  console.log(log);
})