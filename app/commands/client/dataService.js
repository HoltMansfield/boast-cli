var rek = require('rekuire');
var Hogan = require('hogan.js');
var fs = require('fs');
var Promise = require('bluebird');
var templateLoader = rek('boast-load-template');

// we don't initialize these vars until the commman is actually called
var boastConfig;
var templatePath;

// console.log('boastConfig::::::::');
// console.log(JSON.stringify(boastConfig));

var createDataService = function(args) {
  return templateLoader.loadTemplate(templatePath +'collection-data-service.js')
    .then(function(templateContent) {
      var template = Hogan.compile(templateContent);
      var output = template.render(args);
      var filePath = process.env.BOAST_PROJECT_PATH
                    +boastConfig.angular.paths.dataServices
                    +args.collectionNamePlural +'-data-service.js';

      return {
        filePath: filePath,
        fileContent: output
      };
    })
    .catch(function(err) {
      console.log('fs error in createDataService');
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
        console.log('\n*** fs error in createDataService writeFile ***');
        console.log('err %j \n', err);
        throw err;
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
  templatePath = 'app/templates/client/' +boastConfig.angular.language +'/services/'  +'/';
};

module.exports = function(args, callback) {
  initialize();
  //console.log(JSON.stringify(args, null, 2));
  var promises = [];

  // enhance basic arguments
  args.collectionNameCamelCase = capitalizeFirstLetter(args.collectionName);
  args.collectionNamePluralCamelCase = capitalizeFirstLetter(args.collectionNamePlural);

  // read in arguments into config
  if(args.options.language) boastConfig.language = args.options.language;

  // enhance from config
  args.moduleName = boastConfig.angular.modules.dataServices;

  promises.push(createDataService(args));

  Promise.all(promises)
    .then(writeFiles)
    .catch(function(err) {
      console.log('*** error caught in data-service command ***');
      console.log(err.message);
      //console.log(err.stack);
      console.log('__________________________________________________________________________');
    })
    .finally(callback);
};
