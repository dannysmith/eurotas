var mongoose = require("mongoose");

var pushSchema = mongoose.Schema({
  id: String,
  timestamp: { type: Date, default: Date.now },
  repo: String,
  pusher: String,
  payload: {
    ref: String,
    beforeSha: String,
    afterSha: String,
    diffUrl: String,
    head: {
      id: String,
      tree_id: String,
      message: String,
      timestamp: String
    }
  }
}); 

module.exports = mongoose.model("Push", pushSchema);