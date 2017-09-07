var mongoose = require('mongoose');
const Schema = mongoose.Schema;

module.exports = new Schema(
  {
    dateCreated: { type: Date, default: Date.now },
    userId: { type: String, required: true },
    code: { type: Schema.ObjectId, ref: "participants" }
  }
);
