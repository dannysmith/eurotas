var rp = require("request-promise");
var config = require("../config/config");

var Tree = require("../models/tree");

function mapTrees(tree) {
  var trees = [];
  parseTree(tree);
}

function parseTree(tree) {
  var parsedTree = tree.map(function(item) {
    if (item.type === "blob") {
      var uri = "https://api.github.com/repos/" + 
            config.github.origin + 
            "/git/blobs/" + item.sha
      return rp(uri)
        .then(function(res) {
          return {
            path: item.path,
            mode: item.mode,
            type: item.type,
            content: res.content
          }
        })
        .catch(function(err) {
          return console.log(err);
        })
    } else {

    }
  });
  trees.push(parsedTree);
  return configureRequest(parsedTree);
}

function configureRequest(parsedTree) {
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
    body: { tree: parsedTree },
    json: true
  };
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

module.exports = { parseTree: parseTree };