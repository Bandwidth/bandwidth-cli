const { Command } = require('commander');
const utils = require('./api-utils');
var numbers = require("@bandwidth/numbers");
const inquirer = require('inquirer');
numbers.Client.globalOptions.accountId = process.env.BANDWIDTH_ACCOUNT_ID;
numbers.Client.globalOptions.userName = process.env.BANDWIDTH_API_USER;
numbers.Client.globalOptions.password = process.env.BANDWIDTH_API_PASSWORD;

const Bandwidth = require("node-bandwidth");

const client = new Bandwidth({
	userId    : process.env.BANDWIDTH_ACCOUNT_ID,
	apiToken  : process.env.BANDWIDTH_API_USER,
	apiSecret : process.env.BANDWIDTH_API_PASSWORD
}); //TODO: actually use the SDK. For now, the API utils function just seems to make a lot more sense.




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
  .action(async (name, cmdObj) => {
    const options = cmdObj.opts();
    switch (options.type) {
      case 'v':
      case 'voice':
        {
          const voiceAppPrompts = [
            {
              type: 'input',
              name: 'callInitiatedCallbackUrl',
              message: "Please enter a callInitiatedCallbackUrl" //this is the only mandatory field so far.
            }
          ]
          const answers = await inquirer.prompt(voiceAppPrompts);
          const createdApp = await utils.createVoiceApplication({
            name: name,
            callInitiatedCallbackUrl: answers.callInitiatedCallbackUrl
          })
          console.log(createdApp)
        }
        break;
      case 'm':
      case 'messaging':
        {
          const messageAppPrompts = [
            {//consider delcaring this elsewhere??? Seems like clutter.
              type: 'input',
              name: 'msgCallbackUrl',
              message: "Please enter a message callbackUrl"
            }
          ]
          const answers = await inquirer.prompt(messageAppPrompts);
          const createdApp = await utils.createMessageApplication({
            name: name,
            msgCallbackUrl: answers.msgCallbackUrl
          })
          console.log(createdApp)
        }
        break;
      default:
        console.log('type must be either voice(v) or messaging(m)')
    }
  })

const createSiteCmd = createCmd.command('site <name>')
  .alias('s')
  .action(async (name, cmdObj) => {
    const options = cmdObj.opts();
  })

const createSippeerCmd = createCmd.command('sipper <name>')
  .alias('p')
  .alias('sip')
  .action(async (name, cmdObj) => {
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
      console.log(sitesList) //FIXME probably make a table here.
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
