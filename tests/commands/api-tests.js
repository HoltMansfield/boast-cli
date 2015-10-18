process.env.BOAST_CLI_PATH = process.env.PWD +'/';
process.env.BOAST_PROJECT_PATH = process.env.PWD +'/test-output/';

var rek = require('rekuire');
var apiCommand = rek('api.js');

describe('api command',function() {
  it('should change the world', function(done) {
    var arguments =
    {
      "options": {},
      "collectionName": "user",
      "collectionNamePlural": "users"
    };

    apiCommand(arguments, done);
  });
});
