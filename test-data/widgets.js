var mongoose     = require('mongoose');
var mongooseSchema       = mongoose.Schema;

var schema  =  {
  name: { type: String, required: true },
  sin: { type: Number, required: true },
  dateJoined: { type: Date, required: true }
}

module.exports = schema;
