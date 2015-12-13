var Promise = require('bluebird');
var exec = require('child_process').exec;

var command = function(resolve, reject, commandText) {
  exec(commandText, function (error, stdout, stderr) {
    if (error == null) {
      resolve();
    } else {
      reject(error);
    }
  });
}

module.exports.command = function(commandText) {
  return new Promise(function(resolve, reject){
    command(resolve, reject, commandText);
  });
};
