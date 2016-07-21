/*

To make our Vorpal commands testable, we use this resolver to make them callable from Vorpal and from Mocha

When Vorpal calls this function it provides the following arguments:
  callback

When Mocha calls this function it provides the following arguments:
  resolve, reject

*/

var makeResolver = function(resolve, reject) {
  var vorpalCallback;
  var resolve;
  var reject;

  if(arguments.length === 1) {
    // Vorpal is invoking our command
    vorpalCallback = arguments[0];
  } else {
    // Mocha is invoking our command
    resolve = arguments[0];
    reject = arguments[1];
  }

  return function(data) {
    if(vorpalCallback) {
      // return execution to Vorpal
      vorpalCallback();
    } else {
      // return a promise to Mocha test
     resolve(data);
    }
  };
}

module.exports.makeResolver = makeResolver;
