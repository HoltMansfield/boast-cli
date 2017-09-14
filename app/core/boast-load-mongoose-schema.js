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
  string = string.replace(/String/g,'"String"');
  string = string.replace(/Number/g,'"Number"');

  // double quote all occurrences of Date
  string = string.replace(/Date/g,'"Date"');

  // the regex above will incorrectly map Date.now to "Date".now, so here we repair that
  string = string.replace(/"Date".now/g,'"Date.now"'); // this becomes a special token that will be checked for downstream

  string = string.replace(/Boolean/g,'"Boolean"');

  return string;
};

var mapObjectReferences = function(string) {
  // what am I actually doing here?  mapping this type to a token that I can use later?
  // seems like I'm making it possible to eval this later on

  // match the array of objectId's first so it doesn't match the one below
  string = string.replace(/\[Schema.Types.ObjectId\]/g, '"ObjectIdArray"');
  string = string.replace(/Schema.Types.ObjectId/g, '"ObjectId"');

  return string;
}

var stripLines = function(resolve, reject, data) {
  var lines = data.split('\n');


  var json = [];//['{'];

  // grab each line that isn't a comment and add to array
  for(var i = 4; i < lines.length -2; i++) {
      var comments = '//';

      if(lines[i].indexOf(comments) === -1) {
        json.push(lines[i]);
      }
      //console.log('found line %j' +i, lines[i])
  }

  // convert arry to a string
  var string = json.join('');

  //console.log('result string ', string)

  // wrap mongo types in qoutes because eval does funky things
  string = doubleQuoteMongoTypes(string);

  // map objectId types to something JSON safe
  string = mapObjectReferences(string);

  // remove trailing semi-colon
  string = string.substring(0, string.length - 1);

  // add the trailing brace for the JSON dictionary we are building up
  string += '}';

  var jsonModel;

  // convert string to JSON
  try {
    jsonModel = eval('(' + string + ')');
  } catch(e) {
    console.log('boast-load-mongoose-schema EVAL failed', e);
    console.log(string);

    reject(e);
  };

  //console.log('result json %j ', jsonModel)

  return jsonModel;
}

var addRequiredFields = function(resolve, reject, schema) {
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

var addTestField = function(resolve, reject, schema) {
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
  var fullpath = `${path}/${modelName}.js`;

  fs.readFile(fullpath, 'utf8', function (err, data) {
    if (err) {
      console.log('\n Errror in fs.readFile boast-load-mongoose-schema %j \n', err)
      reject(err);
    }

    var schema = stripLines(resolve, reject, data);

    addRequiredFields(resolve, reject, schema);
    addTestField(resolve, reject, schema);

    resolve(schema);
  });
};

module.exports.readSchema = function(path, modelName) {
  return new Promise(function(resolve, reject) {
    readSchema(resolve, reject, path, modelName);
  });
};
