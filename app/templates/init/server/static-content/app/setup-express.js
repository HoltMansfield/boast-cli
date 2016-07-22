var Promise = require('bluebird');
var rek = require('rekuire');  
var express    = require('express');
var expressJwt = require('express-jwt');
var errorHandling  = rek('error-handling');

var doInitialization = function(resolve, reject) {
    var app = express();

    resolve(app);
};

var doListen = function(resolve, reject, app) {
     // default port
    process.env.PORT = process.env.PORT || 3000;

    // default to the development environment
    process.env.NODE_ENV = 'development';

    app.set('port', process.env.PORT);

    app.listen(app.get('port'), function() {
        resolve(app);
    });   
};

var preRoutesInitalization = function(resolve, reject, app) {
  // parse all urls for JWT except route included in 'path' below
  app.use(expressJwt({ secret: 'toDo: use cert'})
                    .unless({
                      path:
                      [
                          { url: '/api/admins/login', methods: ['POST']  },
                          { url: '/api/users', methods: ['POST']  },
                          { url: '/', methods: ['GET']  },
                      ],
                    }));

  resolve(app);                    
};

var postRoutesInitalization = function(resolve, reject, app) {
  /*
     api route handlers are the entry point to this api-server
     the route handlers use tight promise chains and handle their own errors

     nothing should ever bubble up to this global error handler
     if it does, this error handler is here to let us know we have a leak in our promise chains/error handling
  */
  app.use(errorHandling.requestErrorHandler);    

  resolve(app);               
};


// the first method called during startup takes no arguments
module.exports.initialize = function() {
    return new Promise(doInitialization);
};

// The actual http listener
module.exports.listen = function(app) {
    return new Promise(function(resolve, reject) {
        return doListen(resolve, reject, app);
    });
};

// Middleware that needs to be configured BEFIRE routes are created
module.exports.preRoutesInitalization = function(app) {
    return new Promise(function(resolve, reject) {
        return preRoutesInitalization(resolve, reject, app);
    });
};

// Middleware that needs to be configured AFTER routes are created
module.exports.postRoutesInitalization = function(app) {
    return new Promise(function(resolve, reject) {
        return postRoutesInitalization(resolve, reject, app);
    });
};