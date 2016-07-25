var rp = require("request-promise");
var config = require("../config/config");

var Tree = require("../models/tree");

function configurePost(tree) {
  console.log("\n=======================\nconfiguring post");
  var uri = "https://api.github.com/repos/" + 
            config.github.destination + 
            "/git/trees";
  var options = {
    method: "POST",
    uri: uri,
    headers: {
      'User-Agent': 'Request-Promise',
      'Authorization': "token " + config.github.apiKey
    },
    body: { tree: tree },
    json: true
  };
  console.log("\n\nTree: " + tree + "\n\n");
  return postTree(options);
}

function postTree(options) {
  return rp(options)
    .then(function(res) {
      return console.log("\n=======================\nRepo updated! Check github");
    })
    .catch(function(err) {
      return console.log(err);
    });
}

module.exports = { configurePost: configurePost };