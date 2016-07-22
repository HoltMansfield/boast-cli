var Promise = require("bluebird");
var chalk = require('chalk');
var walk = require('walk');
var fs = require('fs');


var appIn; // express app gets passed in and we assign it here

var loadRoutesModule = function(root, fileStats, next) {
    var moduleName = fileStats.name.replace('.js','');
    var modulePath = root +'/'  +moduleName;
    
    //require in this module
    var m = require(modulePath);

    // create the routes in this module
    m(appIn);

    next();
}

var importRoutes = function(resolve, reject) {
  var srcpath = __dirname +'/auto-loaded';

  // npm package 'walk' used here to recursively load all routes in the 'auto-loaded

  var options = {
      listeners: {
        names: function (root, nodeNamesArray) {
          nodeNamesArray.sort(function (a, b) {
            if (a > b) return 1;
            if (a < b) return -1;
            return 0;
          });
        }
      , directories: function (root, dirStatsArray, next) {
          // don't do anything with directories, keep walking
          next();
        }
      , file: function (root, fileStats, next) {
          // for each file call this function
          loadRoutesModule(root, fileStats, appIn, next);
        }
      , errors: function (root, nodeStatsArray, next) {                  
          next(); 
        }
      }
    };

    walker = walk.walkSync(srcpath, options);

    resolve(appIn);
};

module.exports.createRoutes = function (app) {
    appIn = app;
    return new Promise(importRoutes);
};
