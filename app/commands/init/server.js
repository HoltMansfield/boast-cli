var rek = require('rekuire');
var Promise = require('bluebird');
var Hogan = require('hogan.js');
var fs = require('fs');
var Task = require('shell-task');
var R = require('ramda');

var boastResolve = rek('boast-resolve');
var boastShell = rek('boast-shell');
var boastInquirer = rek('boast-inquirer');
var boastConfig = rek('boast-config');
var templateLoader = rek('boast-load-template');
var boastIO = rek('boast-io');


var confirmServerLocation = function(commandState) {
  var questions = [];
  var path = process.env.PWD;

  questions.push({
    type: "confirm",
    name: "continue",
    message: "Create a boast-server right here: " +path +" ?",
    default: false
  });

  return boastInquirer.prompt(questions)
          .then(function(answers) {
            commandState.answers = answers;
            return commandState;
          });
}

var npmInstall = function(commandState) {
  return new Promise(function(resolve, reject) {
    boastShell.command('npm i')
      .then(function() {
        resolve(commandState);
      });
  });
};

var packageJson = function(commandState) {
  var fileName = 'package.json';
  var templatePath = 'app/templates/init/server/' +fileName;

  return templateLoader.processTemplate(templatePath, fileName, commandState);
};

var boastJson = function(commandState) {
  var fileName = 'boast.json';
  var templatePath = 'app/templates/init/server/' +fileName;

  return templateLoader.processTemplate(templatePath, fileName, commandState);
};

var writeFile = function(boastFileOutput, commandState) {
  var path = boastFileOutput.filePath;

  if(commandState.args.ENV = 'test') {
    path = process.env.BOAST_CLI_PATH + '/test-output/init/server';
  }

  return boastIO.writeFile(path, boastFileOutput.fileContent);
};

var writeFilesToDisk = function(commandState) {
  var writeFilePromises = [];

  if(commandState.args.ENV = 'test') {
    path = process.env.BOAST_CLI_PATH + '/test-output/init/server';
  }

  commandState.boastFileOutputs.forEach(function(element) {
    writeFilePromises.push(boastIO.writeFile(element.filePath, element.fileContent, commandState));
  });

  return Promise.all(writeFilePromises)
          .then(function() {
            return commandState;
          });
};

var writeFiles = function(commandState) {
  commandState.boastFileOutputs = [];

  return R.composeP(writeFilesToDisk,packageJson, boastJson)(commandState);
};

var initializeState = function(args) {
  // official stateKeeper for this command lifecycle
  var commandState = {};

  // capture reference to args
  commandState.args = args;

  boastConfig.api = {
    language: 'es5' // default to es5, allow override from CLI
  };

  commandState.templatePath = 'app/templates/init/server/' +boastConfig.api.language +'/';

  // default dbName to appName
  if(!commandState.args.dbName) {
    commandState.args.dbName = commandState.args.appName;
  }

  return commandState;
};

// var loadBoastConfig = function(commandState) {
//   return boastConfig.loadConfig()
//           .then(function(boastConfig) {
//
//             // check for an api config section
//             if(boastConfig && !!boastConfig.api) {
//               // if boast config not found set defaults
//               boastConfig.api = {};
//               boastConfig.api.language = 'es5';
//             }
//
//             // configure our commandState
//             commandState.templatePath = 'app/templates/init/server/' +boastConfig.api.language +'/';
//             commandState.boastConfig = boastConfig;
//
//             return commandState;
//           });
// };

// args from vorpal command, call callback when done to notify vorpal
var command = function(args, resolve, reject) {
  var commandState = initializeState(args);

  // Lets confirm with the user they want to use this path
  confirmServerLocation(commandState)
    .then(function(commandState) {
      if(commandState.answers.continue) {
        // execute promise chain R to L <=== (data)
        R.composeP(resolve, npmInstall, writeFiles)(commandState);
      } else {
        // exit and return, user is aborting
        resolve(commandState);
      }
    });
};

var promise = function(args) {
  args.ENV = 'test';

  return new Promise(function(resolve, reject) {
    // let boast-resolve figure out if we are running through vorpal or mocha
    resolve = boastResolve.makeResolver(resolve, reject);

    command(args, resolve, reject);
  });
}

var action = function(args, vorpalCallback) {
  args.ENV = 'CLI';

  // let boast-resolve figure out if we are running through vorpal or mocha
  var resolve = boastResolve.makeResolver(vorpalCallback, null);

  command(args, resolve);
};

module.exports = {
  promise: promise,
  action: action
};
