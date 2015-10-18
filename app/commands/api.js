var rek = require('rekuire');
var Hogan = require('hogan.js');
var fs = require('fs');
var Promise = require('bluebird');
var templateLoader = rek('boast-load-template');
var boastConfig = JSON.parse(fs.readFileSync('./boast.json', 'utf8'));


var createApiRoutesTests = function(args) {
  return templateLoader.loadTemplate('app/templates/api-routes-tests.tmpl')
    .then(function(templateContent) {
      var template = Hogan.compile(templateContent);
      var output = template.render(args);
      //console.log(output);

      return {
        filePath: process.env.BOAST_PROJECT_PATH +boastConfig.routesTestsPath +args.collectionNamePlural +'-routes-tests.js',
        fileContent: output
      };
    })
    .catch(function(err) {
      throw err;
    });
};

var createApiModule = function(args) {
  return templateLoader.loadTemplate('app/templates/api-module.tmpl')
    .then(function(templateContent) {
      var template = Hogan.compile(templateContent);
      var output = template.render(args);
      //console.log(output);

      return {
        filePath: process.env.BOAST_PROJECT_PATH +boastConfig.apiModulesPath +args.collectionNamePlural +'-api.js',
        fileContent: output
      };
    })
    .catch(function(err) {
      throw err;
    });
};

var createRoutes = function(args) {
  return templateLoader.loadTemplate('app/templates/api-routes.tmpl')
    .then(function(templateContent) {
      var template = Hogan.compile(templateContent);
      var output = template.render(args);
      //console.log(output);

      return {
        filePath: process.env.BOAST_PROJECT_PATH +boastConfig.routesPath +args.collectionNamePlural +'-routes.js',
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
  fs.writeFile(boastFileOutput.filePath, boastFileOutput.fileContent, function(err) {
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

module.exports = function(args, callback) {
  //console.log(JSON.stringify(args, null, 2));
  var promises = [];

  // enhance basic arguments
  args.collectionNameCamelCase = capitalizeFirstLetter(args.collectionName);
  args.collectionNamePluralCamelCase = capitalizeFirstLetter(args.collectionNamePlural);

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
