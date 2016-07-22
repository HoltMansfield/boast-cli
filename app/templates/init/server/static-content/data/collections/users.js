var mongoose     = require('mongoose');
var mongooseSchema       = mongoose.Schema;

var schema  =  {
    dateCreated: { type: Date, default: Date.now },
    email: { type: String, required: true, unique: true },
    salt: { type: String },
    passwordResetGuid: { type: String }, // used in password reset link
    password: { type: String },

    first: { type: String },
    last: { type: String },

    //account type
    isAdmin: { type: Boolean, required: true },

    //permissions: { type: [mongooseSchema.ObjectId], ref: 'permissions' },

    // the brands this user has permissions to modify
    ownedBrands: { type: [mongooseSchema.ObjectId], ref: 'brands' }
}

module.exports = schema;