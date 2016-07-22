// this file is called directly to start the server // test instances directly call app.createServer

var rek = require('rekuire');
var createServer = rek('create-server');
var errorHandling  = rek('error-handling');

// set the development environment
process.env.NODE_ENV = 'development';
process.env.PORT = process.env.PORT || 3000;

// start the app
createServer
    .createServer()
    .then(function() {
      console.log('self reported study api server running');
    })
    .catch(errorHandling.handleError);        