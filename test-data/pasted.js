var mongoose = require('mongoose');
const Schema = mongoose.Schema;

module.exports = new Schema(
  {
    dateCreated: { type: Date, default: Date.now },
    code: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, ref: "participants" }
  }
);
