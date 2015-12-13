// Takes in bluebird: resolve, reject
// *** alternatively ***
// Takes in vorpal callback which we alias to resolve

var makeResolver = function(resolve, reject) {
  return function(data) {
    if(!reject) {
      //running through vorpal
      resolve();
    } else {
      // running through mocha
     resolve(data);
    }
  };
}

module.exports.makeResolver = makeResolver;
