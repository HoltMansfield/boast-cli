var rek = require('rekuire');

var consoleMessages = rek('console-messages');

module.exports.requestErrorHandler = function(err, req, res, next) {
  var validationErrors = null;

  if(err && err.errors) {
    validationErrors = err.errors;
  }

  res
  .status(422)
  .json(
  {
      success: false,
      name: err.name,
      message: err.message,
      stack: err.stack,
      validationErrors: validationErrors
  });

  if(!err.message || err.message.length === 0) {
    consoleMessages.error('EMTPY ERROR FOUND');
    consoleMessages.error('Need to investigate and refactor');
  }

  consoleMessages.error(err.message);
};

module.exports.errorHandler = function(err) {
  consoleMessages.error(err);
};