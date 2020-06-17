const { Command } = require('commander');
const utils = require('./api-utils')
var numbers = require("@bandwidth/numbers");
numbers.Client.globalOptions.accountId = process.env.BANDWIDTH_ACCOUNT_ID;
numbers.Client.globalOptions.userName = process.env.BANDWIDTH_API_USER;
numbers.Client.globalOptions.password = process.env.BANDWIDTH_API_PASSWORD;
module.exports.program = program = new Command();

const description = 'A descriptive description to describe something worth describing with a description.';
program
  .version('0.0.1')
  .description(description);

/**************************'CREATE' COMMAND**************************/

const createCmd = program.command('create')
  .alias('c')

const createAppCmd = createCmd.command('app <name>')
  .alias('a')
  .requiredOption('-t, --type <type>', 'An application must be a voice(v) or messaging(m) application')
  .action((name, cmdObj) => {
    const options = cmdObj.opts();
    switch (options.type) {
      case 'v':
      case 'voice':
        {
          utils.createVoiceApplication({
            name: name
          })
        }
        break;
      case 'm':
      case 'messaging':
        {
          console.log('creating messaging app')
        }
        break;
      default:
        console.log('type must be either voice(v) or messaging(m)')
    }
  })




/**************************'LIST' COMMAND**************************/

const listCmd = program.command('list');
const listAppCmd = listCmd.command('app <name>')
  .alias('a')

/**************************'DELETE' COMMAND**************************/

const deleteCmd = program.command('delete');
