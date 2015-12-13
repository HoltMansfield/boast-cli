var fs = require('fs');

var loadTemplate = function(resolve, reject, templatePath) {
  fs.readFile(process.env.BOAST_CLI_PATH +templatePath,'utf8', function (err, data) {
    if(err) {
      reject(err);
    }

    resolve(data);
  });
};

module.exports.loadTemplate = function(templatePath) {
  return new Promise(function(resolve, reject) {
    loadTemplate(resolve, reject, templatePath);
  });
};
