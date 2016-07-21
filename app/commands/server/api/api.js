var rek = require('rekuire');
var Hogan = require('hogan.js');
var fs = require('fs');
var Promise = require('bluebird');
var templateLoader = rek('boast-load-template');
var mongooseLoader = rek('boast-load-mongoose-schema');
var utf8 = require('utf8');

// we don't initialize these vars until the commmand is actually called
var boastConfig;
var templatePath;

var createApiRoutesTests = function(args) {
  return templateLoader.loadTemplate(templatePath +'api-routes-tests.tmpl')
    .then(function(templateContent) {
      var template = Hogan.compile(templateContent);
      var output = template.render(args);
      var filePath = process.env.BOAST_PROJECT_PATH
                     +boastConfig.api.paths.routesTestsPath
                     +args.collectionNamePlural +'-routes-tests.js';

      return {
        filePath: filePath,
        fileContent: output
      };
    })
    .catch(function(err) {
      throw err;
    });
};

var createApiModule = function(args) {
  return templateLoader.loadTemplate(templatePath +'api-module.tmpl')
    .then(function(templateContent) {
      var template = Hogan.compile(templateContent);
      var output = template.render(args);
      var filePath = process.env.BOAST_PROJECT_PATH
                    +boastConfig.api.paths.apiModulesPath
                    +args.collectionNamePlural +'-api.js';

      return {
        filePath: filePath,
        fileContent: output
      };
    })
    .catch(function(err) {
      throw err;
    });
};

var createRoutes = function(args) {
  return templateLoader.loadTemplate(templatePath +'api-routes.tmpl')
    .then(function(templateContent) {
      var template = Hogan.compile(templateContent);
      var output = template.render(args);
      var filePath = process.env.BOAST_PROJECT_PATH
                    +boastConfig.api.paths.routesPath
                    +args.collectionNamePlural +'-routes.js';

      return {
        filePath: filePath,
        fileContent: output
      };
    })
    .catch(function(err) {
      throw err;
    });
};

var capitalizeFirstLetter = function(string) {
  if(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  } else {
    return string;
  }
};

var writeFile = function(boastFileOutput) {
  fs.writeFile(boastFileOutput.filePath, new Buffer(boastFileOutput.fileContent, 'utf8'), function(err) {
      if(err) {
          return console.log(err);
      }

      console.log("The file was saved!");
  });
};

var writeFiles = function(boastFileOutputs) {
  var writeFilePromises = [];

  boastFileOutputs.forEach(function(element) {
    writeFilePromises.push(writeFile(element));
  });

  return Promise.all(writeFilePromises);
};

var initialize = function() {
  boastConfig = JSON.parse(fs.readFileSync('./boast.json', 'utf8'));
  templatePath = 'app/templates/server/' +boastConfig.api.language +'/';
};

var addTestDocumentAssignments = function(schema) {
  var testDocumentAssignments = [];

  for(field in schema) {
    var typeValue = schema[field].type;

    switch(typeValue) {
       case 'String':
        var assignment = 'testDocument.' +field +' = ' +'\'' +field +'_\'' +'+testDataIndex' +';\n';
        testDocumentAssignments.push(assignment);
        break;
      case 'Date':
        var assignment = 'testDocument.' +field +' = ' +'new Date()' +';\n';
        testDocumentAssignments.push(assignment);
        break;
      case 'Number':
        var assignment = 'testDocument.' +field +' = ' +'testDataIndex;\n';
        testDocumentAssignments.push(assignment);
        break;
      case 'Boolean':
        var assignment = 'testDocument.' +field +' = ' +'true,\n';
        testDocumentAssignments.push(assignment);
        break;
    }
  }

  // map the array back to a string
  testDocumentAssignments = testDocumentAssignments.join('');

  // update schema
  schema.testDocumentAssignments = testDocumentAssignments;

  // return so we can add it to vorpal args
  return testDocumentAssignments;
};

var runCommand = function(args, callback) {
  var promises = [];

  promises.push(createRoutes(args));
  promises.push(createApiModule(args));
  promises.push(createApiRoutesTests(args));

  Promise.all(promises)
    .then(writeFiles)
    .catch(function(err) {
      console.log('*** error caught in command ***');
      console.log(err.message);
      console.log('__________________________________________________________________________');
    })
    .finally(callback);
};

module.exports = function(args, callback) {
  initialize();
  // fetch the mongoose model
  mongooseLoader.readSchema(boastConfig.mongoose.modelsPath, args.collectionNamePlural)
    .then(function(schema) {
      // console.log(schema);

      // enhance basic arguments
      args.schema = schema;
      args.testDocumentAssignments = addTestDocumentAssignments(schema);
      args.collectionNameCamelCase = capitalizeFirstLetter(args.collectionName);
      args.collectionNamePluralCamelCase = capitalizeFirstLetter(args.collectionNamePlural);

      if(!args.testField) {
        // if this value is not supplied at the command line, infer it from mongoose schema
        args.testField = args.schema.testField;
      }

      // read in arguments into config
      if(args.options.language) boastConfig.language = args.options.language;

      return runCommand(args, callback);
    })
    .catch(function(err) {
      console.log('mongooseLoader.readSchema', err);
    });
};
