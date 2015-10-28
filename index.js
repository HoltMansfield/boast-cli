var vorpal = require('vorpal')();

process.env.BOAST_CLI_PATH = process.env.PWD +'/node_modules/boast-cli/';
process.env.BOAST_PROJECT_PATH = process.env.PWD +'/';

// SERVER
var apiCommand = require('./app/commands/server/api/api.js');

vorpal
  .command('api [collectionName] [collectionNamePlural] [testField]', 'Creates API routes, module, tests for Mongoose Schema')
  .option('-l, --language [language]', 'Sets language used for creating code. [es5, es6, esNext]')
  .action(apiCommand);

// CLIENT
var dataService = require('./app/commands/client/dataService.js');

vorpal
  .command('data-service [collectionName] [collectionNamePlural]', 'Creates Angular Service for data operations')
  .action(dataService);

vorpal
  .delimiter('boast-cli$')
  .show();
