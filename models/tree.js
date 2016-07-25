var mongoose = require("mongoose");

var treeSchema = mongoose.Schema({
  sha: String,
  url: String,
  tree: [{}],
  truncated: Boolean
});

module.exports = mongoose.model("Tree", treeSchema);