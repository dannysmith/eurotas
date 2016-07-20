var util = require("util");

var Push = require("../models/push");

function create(req, res) {
  console.log("request happening =============================");
  console.log(util.inspect(req.read, false, null));
  return res.end("request successfully received!");
}

module.exports = { create: create };