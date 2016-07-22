process.env.BOAST_CLI_PATH = process.env.PWD +'/';
process.env.BOAST_PROJECT_PATH = process.env.PWD +'/test-output/';
var rek = require('rekuire');
var Promise = require('bluebird');
var chai = require('chai');
var sinon = require('sinon');
var expect = chai.expect;

var sinonChai = require("sinon-chai");
chai.use(sinonChai);


// Start Testing
var apiCommand = rek('api.js');

// require so we can stub
var boastShell = rek('boast-shell');
var boastInquirer = rek("boast-inquirer");
var fs = require('fs');


describe('api command',function() {
  it('should generate three files', function(done) {
    var arguments =
    {
      "options": {
        "language": "es7"
      },
      "collectionName": "pasted",
      "collectionNamePlural": "pasted"
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

var initServerCommand = rek('server.js');

describe('initServer command',function() {
  var commandStub;
  var promptStub;
  var fsStub;

  beforeEach(function() {
    commandStub = sinon.stub(boastShell, 'command', function() {
      return new Promise(function(resolve, reject) {
        resolve();
      });
    });

    promptStub = sinon.stub(boastInquirer, 'prompt', function() {
      return new Promise(function(resolve, reject) {
        resolve({
          continue: true,
        });
      });
    });

    fsStub = sinon.stub(fs, 'writeFile', function(path, bytes, callback) {
      callback();
    });
  });

  it('should generate 1 file', function(done) {
    var arguments =
    {
      "appName": "stopDWB"
    };

    initServerCommand.promise(arguments)
      .then(function(result) {
        expect(result.dbName).to.equal(arguments.appName);
        expect(commandStub).to.have.been.calledWith('npm i');
        sinon.assert.callCount(fsStub, 2);

        done();
      })
      .catch(function(err) {
        console.log(JSON.stringify(err));
        throw err;
      });
  });
});
