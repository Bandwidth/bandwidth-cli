const { Command } = require('commander');
const utils = require('./api-utils');
var numbers = require("@bandwidth/numbers");
const inquirer = require('inquirer');
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
  .requiredOption('-t, --addressType <type>', 'A site must be a billing(b) or service(s) application')
  .action(async (name, cmdObj) => {
    const options = cmdObj.opts();
    let addressType;
    if (options.addressType === 's') {addressType = 'service'}
    if (options.addressType === 'b') {addressType = 'billing'}
    if (addressType !== 'service' && addressType !== 'billing') {
      throw Error('addressType must be either service(s) or billing(b)')
    }
    const sitePrompts = [
      {
        type: 'input',
        name: 'addressLine1',
        message: "Sites require an address. Please enter address line 1"
      },
      {
        type: 'input',
        name: 'addressLine2',
        message: "Please enter the city, state, and ZIP, each seperated by a comma and a space"
      }
    ]
    const answers = await inquirer.prompt(sitePrompts);
    const address = await utils.geocode(answers.addressLine1, ...answers.addressLine2.split(', '))
    const createdSite = await utils.createSite({
      name: name,
      addressType: addressType,
      address: address
    })
    console.log(createdSite)
  })

const createSipPeerCmd = createCmd.command('sipper <name>')
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
    const appList = await utils.listApplications();
    console.log(appList)
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
const listSipPeerCmd = listCmd.command('sippeer <site-id>')
  .alias('p')
  .alias('sippeers')
  .action(async (siteId, cmdObj) => {
    const sipPeerList = await numbers.SipPeer.listAsync(siteId)
    console.log(sipPeerList)
  })

/**************************'DELETE' COMMAND**************************/

const deleteCmd = program.command('delete')
  .alias('d')
  .alias('del')

const deleteAppCmd = deleteCmd.command('app <app-id>')
  .alias('a')
  .alias('applicatiion')
  .action(async (appId) => {
    utils.deleteApplication(appId)
  })

const deleteSiteCmd = deleteCmd.command('site <site-id>')
  .alias('s')
  .action(async (siteId) => {
    const site = await numbers.Site.getAsync(siteId);
    const res = await site.deleteAsync()
    console.log(res)
  })
