var mongoose = require("mongoose");

var pushSchema = mongoose.Schema({
  eventId: String,
  timestamp: { type: Date, default: Date.now },
  repo: String,
  pusher: String,
  payload: {
    ref: String,
    beforeSha: String,
    afterSha: String,
    diffUrl: String,
    headCommit: {
      id: String,
      treeId: String,
      message: String,
      timestamp: Date
    }
  }
}); 

module.exports = mongoose.model("Push", pushSchema);