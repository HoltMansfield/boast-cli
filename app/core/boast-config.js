var Promise = require('bluebird');
var fs = require('fs');


var loadConfig = function(resolve, reject) {
  fs.readFile('./boast.json', 'utf8', function(err, data){
    if(!err) {
      if(data) {
        var json = JSON.parse(data);
        resolve(json);
      } else {
        resolve(undefined);
      }
    }
    else {
      reject(err);
    }
  });
};

module.exports.loadConfig = function() {
  return new Promise(loadConfig);
};
