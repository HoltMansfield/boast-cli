var Promise = require('bluebird');
// official stateKeeper for this command
var commandState = {};


// args from vorpal command, call callback when done to notify vorpal
var action = function(args, resolve, reject) {
  // captures reference to args
  commandState.args = args;

  // default dbName to appName
  if(!commandState.args.dbName) {
    commandState.args.dbName = commandState.args.appName;
  }

   if(!reject) {
     //running through vorpal
     resolve();
   } else {
     // running through mocha
    resolve(commandState);
   }
};

var promise = function(args) {
  return new Promise(function(resolve, reject) {
    action(args, resolve, reject);
  });
}

module.exports.action = action;
module.exports.promise = promise;
