var Promise = require('bluebird');
var fs = require('fs');
var path = require('path');
var config = require('config');

var mongoose = require('mongoose');
var Schema       = mongoose.Schema;

var dbConnection;
var models = {};
var schema = {};

var createCollection = function(file) {
  var modelName = file.replace('.js','');
  var modulePath = './collections/' +modelName;
  var rawJson = require(modulePath);

  // create mongoose schema from definition
  var schema = mongoose.Schema(rawJson);

  // create mongoose model
  var model = mongoose.model(modelName, schema);

  Promise.promisifyAll(model);
  Promise.promisifyAll(model.prototype);

  //aggregate this schema
  schema[modelName] = schema;

  // aggregate this model
  models[modelName] = model;
};

var importModels = function() {
  var srcpath = __dirname +'/collections';

  fs.readdirSync(srcpath).filter(function(file) {
    createCollection(file);
  });
};

module.exports.schema = schema;
module.exports.models = models;

var doConnection = function(resolve, reject, app) {
  var mongoose = require('mongoose');

  // make the async call to 'connect'
  mongoose.connect(config.mongo.connection);
  dbConnection = mongoose.connection;

  // this is only called if we don't handle the error in the callback to an operation
  dbConnection.on('error', console.error.bind(console, 'connection error:'));

  // import our mongoose models (this might read better inside the 'open' callback below)
  importModels();

  // resolve the promise once connected to DB Server
  dbConnection.once('open', function callback() {      
      resolve(app);
  });  
};

module.exports.connect = function(app) {
  return new Promise(function(resolve, reject) {
    return doConnection(resolve, reject, app);
  });
};
