// Test dependencies
var rek = require('rekuire');
var chai = require('chai');
var expect = chai.expect;
var assert = chai.assert;

// System Under Test
var fixture = rek('create-server-once');

describe('Create Server', function() {
  var handleError = function(error) {
    console.log('HANDLE ERROR:');
    console.log(error);

    throw error;
  };

  it('should have the following configuration', function(done) {
    assert.isDefined(fixture);

    fixture.createServerOnce()
      .then(function(app) {        
        expect(app.locals.settings.port).to.equal('3000');

        done();
      })
      .catch(handleError);
  });
});