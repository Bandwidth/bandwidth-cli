const { Command } = require('commander');
module.exports.program = program = new Command();

const description = 'A descriptive description to describe something worth describing with a description.';
program
  .version('0.0.1')
  .description(description);

/**************************'CREATE' COMMAND**************************/

const createCmd = program.command('create');

const createAppCmd = createCmd.command('app')

createAppCmd.action(console.log('create app command invoked'))

/**************************'LIST' COMMAND**************************/

const listCmd = program.command('list');


/**************************'DELETE' COMMAND**************************/

const deleteCmd = program.command('delete');
