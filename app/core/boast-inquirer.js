var Promise = require('bluebird');
var inquirer = require("inquirer");

module.exports.prompt = function(questions) {
  return new Promise(function(resolve, reject) {
    inquirer.prompt(questions, function(answers) {
      resolve(answers);
    });
  });
};
