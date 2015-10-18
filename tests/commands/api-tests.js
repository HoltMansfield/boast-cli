process.env.BOAST_CLI_PATH = process.env.PWD +'/';
process.env.BOAST_PROJECT_PATH = process.env.PWD +'/test-output/';
var rek = require('rekuire');

// Start Testing
var apiCommand = rek('api.js');

describe('api command',function() {
  it('should generate three files', function(done) {
    var arguments =
    {
      "options": {},
      "collectionName": "user",
      "collectionNamePlural": "users"
    };

    apiCommand(arguments, done);
  });
});

var dataServiceCommand = rek('dataService.js');

describe('dataService command',function() {
  it('should generate 1 file', function(done) {
    var arguments =
    {
      "options": {},
      "collectionName": "user",
      "collectionNamePlural": "users"
    };

    dataServiceCommand(arguments, done);
  });
});
