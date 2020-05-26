const { Command } = require('commander');
const program = new Command();

const description = 'A CLI to help developers new to Bandwidth to get ' +
  'set up and order phone numbers.'
program
  .version('0.0.1')
  .description(description)


program.parse(process.argv);
