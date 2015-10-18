var vorpal = require('vorpal')();

process.env.BOAST_CLI_PATH = process.env.PWD +'/node_modules/boast-cli/';
process.env.BOAST_PROJECT_PATH = process.env.PWD +'/';

var apiCommand = require('./app/commands/api.js');

vorpal
  .command('api [collectionName] [collectionNamePlural]', 'Creates API routes, module, tests for Mongoose Schema')
  .action(apiCommand);

vorpal
  .delimiter('boast-cli$')
  .show();
