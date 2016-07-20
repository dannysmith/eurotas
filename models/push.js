var mongoose = require("mongoose");

var pushSchema = mongoose.Schema({
  updateTime: { type: Date, default: Date.now },
  ref: String,
  headSha: String,
  beforeSha: String,
  numberOfCommits: Number,
  author: String,
  commitMessage: String
});

module.exports = mongoose.model("Push", pushSchema);