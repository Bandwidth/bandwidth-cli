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
          console.log('creating a voice app')
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

const createSiteCmd = createCmd.command('site <name>')
  .alias('s')
  .action((name, cmdObj) => {
    const options = cmdObj.opts();
  })

const createSippeerCmd = createCmd.command('sipper <name>')
  .alias('p')
  .alias('sip')
  .action((name, cmdObj) => {
    const options = cmdObj.opts();
  })


/**************************'LIST' COMMAND**************************/

const listCmd = program.command('list')
  .alias('l');
const listAppCmd = listCmd.command('app')
  .alias('a')
  .alias('apps')
  .action(async () => {

    //list things
  })
const listSiteCmd = listCmd.command('site')
  .alias('s')
  .alias('sites')
  .action(async () => {
    try {
      const sitesList = await numbers.Site.listAsync()
      console.log(sitesList)
    } catch {
      console.log('an error has occured')
    }
    //list things
  })
const listSippeerCmd = listCmd.command('sippeer')
  .alias('p')
  .alias('sippeers')
  .action(async () => {
    //list things
  })

/**************************'DELETE' COMMAND**************************/

const deleteCmd = program.command('delete');
