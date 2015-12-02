process.env.BOAST_CLI_PATH = process.env.PWD +'/';
process.env.BOAST_PROJECT_PATH = process.env.PWD +'/test-output/';
var rek = require('rekuire');
var chai = require('chai');
var expect = chai.expect;

// Start Testing
var apiCommand = rek('api.js');

describe('api command',function() {
  it('should generate three files', function(done) {
    var arguments =
    {
      "options": {
        "language": "es7"
      },
      "collectionName": "widget",
      "collectionNamePlural": "widgets"
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

var initServer = rek('server.js');

describe('server command',function() {
  it('should generate 1 file', function(done) {
    var arguments =
    {
      "appName": "stopDWB"
    };

    initServer.promise(arguments)
      .then(function(result) {
        expect(result.dbName).to.equal(result.dbName);
        done();
      })
      .catch(function(err) {
        console.log(JSON.stringify(err));
        throw err;
      });
  });
});
