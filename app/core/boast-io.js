var Promise = require('bluebird');
var fs = require('fs');


var writeFile = function(path, content, commandState) {
  return new Promise(function(resolve, reject) {
    fs.writeFile(path, new Buffer(content, 'utf8'), function(err) {
      if(err) {
        reject(err);
      } else {
        resolve(commandState);
      }
    });
  });
};

module.exports = {
  writeFile: writeFile
};
