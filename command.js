const { Command } = require('commander');
const program = new Command();

const description = 'A descriptive description to describe something worth describing with a description.';
program
  .version('0.0.1')
  .description(description);


program.parse(process.argv);
