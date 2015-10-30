var mongoose     = require('mongoose');
var mongooseSchema       = mongoose.Schema;

var schema  =  {
    // core profile (required fields)  // unique to a campaign ?
    title: { type: String, required: true },
    brandId: { type: mongooseSchema.ObjectId, ref: 'campaigns', required: true },
    type: { type: String },
     // this could be a filename, url, contentId from some CMS
    resource: { type: String },

    // meta-data
    dateCreated: { type: Date },

    // audit trail for admin who updated
    adminId: { type: [mongooseSchema.ObjectId], ref: "media" },
}

module.exports = schema;
