var rek = require('rekuire');
var Promise = require('bluebird');
var boastResolve = rek('boast-resolve');
var boastShell = rek('boast-shell');
var Task = require('shell-task');
var R = require('ramda');

// official stateKeeper for this command
var commandState = {};

var npmInstall = function(commandState) {
  return new Promise(function(resolve, reject) {
    boastShell.command('npm i')
      .then(function() {
        resolve(commandState);
      });
  });
};

// args from vorpal command, call callback when done to notify vorpal
var action = function(args, resolve, reject) {
  // captures reference to args in command stateKeeper
  commandState.args = args;

  // default dbName to appName
  if(!commandState.args.dbName) {
    commandState.args.dbName = commandState.args.appName;
  }

  var f = R.composeP(resolve, npmInstall);

  f(commandState);
};

var promise = function(args) {
  return new Promise(function(resolve, reject) {
    var callback = boastResolve.makeResolver(resolve, reject);

    action(args, callback, reject);
  });
}

module.exports.action = action;
module.exports.promise = promise;
