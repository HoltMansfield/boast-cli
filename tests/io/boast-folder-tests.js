process.env.BOAST_CLI_PATH = process.env.PWD +'/';
process.env.BOAST_PROJECT_PATH = process.env.PWD +'/test-output/';

var rek = require('rekuire');
var Promise = require('bluebird');
var chai = require('chai');
var sinon = require('sinon');
var expect = chai.expect;

var sinonChai = require("sinon-chai");
chai.use(sinonChai);


// System Under Test
var fixture = rek('boast-folder');

// require so we can stub
var fsx = require('fs-extra');
var fsxStub;
var fsxSpy;

var stubCallback = function(source, destination, callback) {
  callback();
};

describe('boast-folder copyFolder',function() {
  var commandState = {
    state: 'mock-state-value'
  };

  beforeEach(function() {
    fsxStub = sinon.stub(fsx, 'copy', stubCallback);
    //fsxStub.onCall(0).returns(Promise.resolve(commandState));
    //fsxStub.onCall(0).returns(stubCallback);
    //var fsxSpy = sinon.spy(fsx, "copy");
  });

  it('should call fs-extra.copy', function(done) {
    var source = process.env.BOAST_CLI_PATH +'/app/templates/init/server/static-content';
    var destination = process.env.BOAST_PROJECT_PATH +'/server';

    try {
      fixture.copyFolder(source, destination, commandState)
        .then(function(returnedCommandState) {
          // expect(result.dbName).to.equal(arguments.appName);
          // expect(commandStub).to.have.been.calledWith('npm i');
          sinon.assert.callCount(fsxStub, 1);

          expect(returnedCommandState).to.equal(commandState);
          done();
        });
    } catch(e) {
      console.log(e);
    }

  });
});

describe('boast-folder copyFolder',function() {
  var expectedErrorMessage = 'mock-error-message' ;

  beforeEach(function() {
    var stubErrorCallBack = function(source, destination, callback) {
      throw new Error(expectedErrorMessage);
    };

    fsxStub.restore();

    fsxStub = sinon.stub(fsx, 'copy', stubErrorCallBack);
  });

  it('should reject any errors from fs-extra.copy', function(done) {
    var source = process.env.BOAST_CLI_PATH +'/app/templates/init/server/static-content';
    var destination = process.env.BOAST_PROJECT_PATH +'/server';
    var commandState = {
      state: 'mock-state-value'
    };

    fixture.copyFolder(source, destination, commandState)
      .catch(function(returnedError) {
        sinon.assert.callCount(fsxStub, 1);
        expect(returnedError.message).to.equal(expectedErrorMessage);
        done();
      });
  });
});
