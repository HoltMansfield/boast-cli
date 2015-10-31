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
  string = string.replace(/^Date$/,'"Date"');
  string = string.replace(/Boolean/,'"Boolean"');

   return string;
};

var mapObjectReferences = function(string) {
  string = string.replace(/\[mongooseSchema.ObjectId\]/, '"ObjectIdArray"');
  string = string.replace(/mongooseSchema.ObjectId/, '"ObjectId"');


  return string;
}

var stripLines = function(data) {
  // if windows
  // var cleanData = data.replace(/\r/,'');
  // var lines = data.split('\r');
  //else {
  var lines = data.split('\n');
  //}

  var json = ['{'];

  for(var i = 4; i < lines.length -2; i++) {
      var comments = '//';

      if(lines[i].indexOf(comments) === -1) {
        json.push(lines[i]);
      }
  }

  // convert arry to a string
  var string = json.join('');

  // wrap mongo types in qoutes because eval does funky things
  string = doubleQuoteMongoTypes(string);

  string = mapObjectReferences(string);

  // convert string to JSON
  var jsonModel = eval('(' + string + ')');

  return jsonModel;
}

var addRequiredFields = function(schema) {
  var requiredFields = [];
  var requiredFieldNames = [];
  var testField;

  for(fieldName in schema) {
    // grab the first field as the testField name
    if(!testField) testField = fieldName;

    if(schema[fieldName].required) {
      requiredFields.push(schema[fieldName]);
      requiredFieldNames.push(fieldName);
    }
  }

  schema.requiredFields = requiredFields;
  schema.requiredFieldNames = requiredFieldNames;
  schema.testField = testField;
};

var addTestField = function(schema) {
  var testField;

  if(schema.requiredFieldNames) {
    testField = schema.requiredFieldNames[0];
  }

  if(!testField) {
    for(fieldName in schema) {
      // grab the first field as the testField name
      if(!testField) testField = fieldName;
    }
  }

  schema.testField = testField;
};

var readSchema = function(resolve, reject, path, modelName) {
  var fullpath = path + modelName +'.js';

  fs.readFile(fullpath, 'utf8', function (err,data) {
    if (err) {
        reject(err);
    }

    var schema = stripLines(data);
    addRequiredFields(schema);
    addTestField(schema);

    resolve(schema);
  });
};

module.exports.readSchema = function(path, modelName) {
  return new Promise(function(resolve, reject) {
    readSchema(resolve, reject, path, modelName);
  });
};
