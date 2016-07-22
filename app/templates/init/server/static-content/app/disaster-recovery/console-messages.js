var chalk = require('chalk');
var beep = require('beepbeep')

var error = chalk.red.bold;

module.exports.error = function(message) {
  console.log(error('**************** An error has occurred ****************'));
  console.log(error(message));
  beep(1);
};

module.exports.criticalError = function(message) {
  console.log(error('@@@@@@@@@@@@@@ A CRITICAL error has occurred @@@@@@@@@@@@@@'));
  console.log(error(message));
  
  beep(3);
};