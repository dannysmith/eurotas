var mongoose = require("mongoose");

var treeSchema = mongoose.Schema({
  sha: String,
  url: String,
  tree: [
    {
      path: String,
      mode: Number,
      type: String,
      sha: String,
      size: Number,
      url: String
    }
  ],
  truncated: Boolean
});

module.exports = mongoose.model("Tree", treeSchema);