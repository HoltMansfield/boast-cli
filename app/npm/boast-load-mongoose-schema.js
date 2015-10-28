var fs = require('fs');
var Promise = require('bluebird');

// var fixTypes = function(mongooseModel) {
//   // for each over the mongooseModel
//   for(field in mongooseModel) {
//     var typeValue = mongooseModel[field].type;
//
//     switch(typeValue) {
//        case '[Function: String]':
//         mongooseModel[field][key] = 'String';
//         break;
//       case '[Function: Date]':
//         mongooseModel[field][key] = 'Date';
//         break;
//       case '[Function: Number]':
//         mongooseModel[field][key] = 'Number';
//         break;
//     }
//   }
// };

var doubleQuoteMongoTypes = function(string) {
  string = string.replace(/String/,'"String"');
  string = string.replace(/Number/,'"Number"');
  string = string.replace(/Date/,'"Date"');

   return string;
};

var stripLines = function(data) {
  // if windows
  // var cleanData = data.replace(/\r/,'');
  // var lines = data.split('\r');
  //else {
  var lines = data.split('\n');
  //}

  var json = ['{'];

  for(var i = 4; i < lines.length -2; i++) {
      json.push(lines[i]);
  }

  // convert arry to a string
  var string = json.join('');

  // wrap mongo types in qoutes because eval does funky things
  string = doubleQuoteMongoTypes(string);

  // convert string to JSON
  var jsonModel = eval('(' + string + ')');

  return jsonModel;
}

var addRequiredFields = function(schema) {
  var requiredFields = [];
  var requiredFieldNames = [];

    // for each over the mongooseModel
    for(fieldName in schema) {
      if(schema[fieldName].required) {
        requiredFields.push(schema[fieldName]);
        requiredFieldNames.push(fieldName);
      }
    }

    schema.requiredFields = requiredFields;
    schema.requiredFieldNames = requiredFieldNames;
};

var readModel = function(resolve, reject, path, model) {
  var fullpath = path + model +'.js';

  fs.readFile(fullpath, 'utf8', function (err,data) {
    if (err) {
        reject(err);
    }

    var model = stripLines(data);
    addRequiredFields(model);

    resolve(model);
  });
};

module.exports.readSchema = function(path, model) {
  return new Promise(function(resolve, reject) {
    readModel(resolve, reject, path, model);
  });
};
