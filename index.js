var vorpal = require('vorpal')();

// get reference to boast-cli npm package root for reading in templates
process.env.BOAST_CLI_PATH = process.env.PWD +'/node_modules/boast-cli/';

// this is the boast users project path either an angular app or a node server
process.env.BOAST_PROJECT_PATH = process.env.PWD +'/';

// CLIENT COMMANDS
var dataService = require('./app/commands/client/dataService.js');

vorpal
  .command('data-service [collectionName] [collectionNamePlural]', 'Creates Angular Service for data operations')
  .action(dataService);

// INIT COMMANDS
var initServer = require('./app/commands/init/server.js');

vorpal
  .command('init-server [appName] [dbName]', 'Creates Node Server')
  .action(initServer.action);

// SERVER COMMANDS
var apiCommand = require('./app/commands/server/api/api.js');

vorpal
  .command('api [collectionName] [collectionNamePlural] [testField]', 'Creates API routes, module, tests for Mongoose Schema')
  .option('-l, --language [language]', 'Sets language used for creating code. [es5, es6, esNext]')
  .action(apiCommand);

vorpal
  .delimiter('boast$')
  .show();
