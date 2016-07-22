var fs = require('fs');
var Hogan = require('hogan.js');


var loadTemplate = function(templatePath) {
  return new Promise(function(resolve, reject) {
    fs.readFile(process.env.BOAST_CLI_PATH +templatePath,'utf8', function (err, data) {
      if(err) {
        reject(err);
      }

      resolve(data);
    });
  });
};

var processTemplate = function(templatePath, fileName, commandState) {
  return new Promise(function(resolve, reject) {
    return loadTemplate(templatePath)
            .then(function(templateContent) {
              var template = Hogan.compile(templateContent);
              var output = template.render(commandState);
              var filePath = process.env.BOAST_PROJECT_PATH +'package.json';

              commandState.boastFileOutputs.push({
                filePath: filePath,
                fileContent: output
              });

              resolve(commandState);
            });
  });
};

module.exports = {
  loadTemplate: loadTemplate,
  processTemplate: processTemplate
};
