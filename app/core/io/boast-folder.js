var Promise = require('bluebird');
var fsx = require('fs-extra');


var copyFolder = function(source, destination, commandState) {
  return new Promise(function(resolve, reject) {
    fsx.copy(source, destination, function (err) {
     if (err) {
       reject(err);
     }

     resolve(commandState);
    });
  });
};

var processFolder = function(source, destination, commandState) {
  return new Promise(function(resolve, reject) {

  });
};

module.exports = {
  copyFolder: copyFolder,
  processFolder: processFolder
};
