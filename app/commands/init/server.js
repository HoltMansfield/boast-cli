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
/*
toDoLoo:
check for existing package.json, merge in everything but the deps
*/

  return templateLoader.loadTemplate('app/templates/init/server/' +'package.json')
    .then(function(templateContent) {
      var template = Hogan.compile(templateContent);
      var output = template.render(commandState);
      var filePath = process.env.BOAST_PROJECT_PATH +'/package.json';

      /* toDoLoo: commandState.boastFileOutputs.push({
        filePath: filePath,
        fileContent: output
      });

      return commandState;
*/
      return {
        filePath: filePath,
        fileContent: output
      };
    })
    .catch(function(err) {
      throw err;
    });
};

var boastJson = function(commandState) {
  return templateLoader.loadTemplate('app/templates/init/server/' +'boast.json')
    .then(function(templateContent) {
      var template = Hogan.compile(templateContent);
      var output = template.render(commandState);
      var filePath = process.env.BOAST_PROJECT_PATH + 'boast.json';

      commandState.boastFileOutputs.push({
        filePath: filePath,
        fileContent: output
      });

      resolve(commandState)
    })
    .catch(function(err) {
      throw err;
    });
};

var writeFile = function(boastFileOutput) {
  fs.writeFile(boastFileOutput.filePath, new Buffer(boastFileOutput.fileContent, 'utf8'), function(err) {
      if(err) {
          return console.log(err);
      }

      console.log("The file was saved!");
  });
};

var writeFilesToDisk = function(commandState) {
  var writeFilePromises = [];

  boastFileOutputs.forEach(function(element) {
    writeFilePromises.push(writeFile(element));
  });

  return Promise.all(writeFilePromises)
          .then(function() {
            return commandState;
          });
};

var writeFiles = function(commandState) {
  commandState.boastFileOutputs = [];

  /*
toDoLoo:
call writeFilesToDisk as last in this chain

  */

  return R.composeP(packageJson)(commandState);
};

var initializeState = function(args) {
  // official stateKeeper for this command lifecycle
  var commandState = {};

  // capture reference to args
  commandState.args = args;

  // default dbName to appName
  if(!commandState.args.dbName) {
    commandState.args.dbName = commandState.args.appName;
  }

  return commandState;
};

var loadBoastConfig = function(commandState) {
  return boastConfig.loadConfig()
          .then(function(boastConfig) {

            // check for an api config section
            if(boastConfig && !!boastConfig.api) {
              // if boast config not found set defaults
              boastConfig.api = {};
              boastConfig.api.language = 'es5';
            }

            // configure our commandState
            commandState.templatePath = 'app/templates/init/server/' +boastConfig.api.language +'/';
            commandState.boastConfig = boastConfig;

            return commandState;
          });
};

// args from vorpal command, call callback when done to notify vorpal
var command = function(args, resolve, reject) {
  var commandState = initializeState(args);

  // Lets confirm with the user they want to use this path
  confirmServerLocation(commandState)
    .then(function(commandState) {
      if(commandState.answers.continue) {
        // execute promise chain R to L <=== (data)
        R.composeP(resolve, npmInstall, writeFiles, loadBoastConfig)(commandState);
      } else {
        // exit and return, user is aborting
        resolve(commandState);
      }
    });
};

var promise = function(args) {
  return new Promise(function(resolve, reject) {
    // let boast-resolve figure out if we are running through vorpal or mocha
    resolve = boastResolve.makeResolver(resolve, reject);

    command(args, resolve, reject);
  });
}

var action = function(args, vorpalCallback) {
  // let boast-resolve figure out if we are running through vorpal or mocha
  var resolve = boastResolve.makeResolver(vorpalCallback, null);

  command(args, resolve);
};

module.exports = {
  promise: promise,
  action: action
};
