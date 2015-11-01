var mongoose     = require('mongoose');
var mongooseSchema       = mongoose.Schema;

var schema  =  {
  // owning user
  userId: { type: mongooseSchema.ObjectId, ref: 'users' },

  // the actual instance of a credit ie: provided gender
  creditId: { type: mongooseSchema.ObjectId },

  // the actual instance of an incentive ie: 1 Month Free Spotify
  incentiveId: { type: mongooseSchema.ObjectId },

  // the credit value at the time the user realized it
  creditValue: { type: Number, required: true },

  // credit = true, debit = false
  isCredit: { type: String, required: true },

  // instant = true, delayed = false
  isInstant: { type: String, required: true },

  // if the credit is not instant, this is the date the user realizes the credit
  realizationDate: { type: Date },

  // Meta-Data
  dateCreated: { type: Date }
};

module.exports = schema;
