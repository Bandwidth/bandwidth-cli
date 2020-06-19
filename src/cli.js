const { Command } = require('commander');
const utils = require('./api-utils');
const numbers = require("@bandwidth/numbers");
const inquirer = require('inquirer');
const createActions = require('./commands/create');
const deleteActions = require('./commands/delete');
const listActions = require('./commands/list');
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
	.description('Create an organizational category for phone numbers, such as sip peers/locations, sites/sub-accounts, and applications.')

const createAppCmd = createCmd.command('app <name>')
  .alias('a')
  .requiredOption('-t, --type <type>', 'An application must be a voice(v) or messaging(m) application')
  .action(createActions.createAppAction)

const createSiteCmd = createCmd.command('site <name>')
  .alias('s')
  .requiredOption('-t, --addressType <type>', 'A site must be a billing(b) or service(s) application')
  .action(createActions.createSiteAction)

const createSipPeerCmd = createCmd.command('sippeer <name>')
  .alias('p')
  .alias('peer')
  .action(createActions.createSipPeerAction)


/**************************'LIST' COMMAND**************************/

const listCmd = program.command('list')
  .alias('l')
	.description('List the sip peers, sites, and applications associated with your account.');


const listAppCmd = listCmd.command('app')
  .alias('a')
  .alias('apps')
  .action(listActions.listAppAction);

const listSiteCmd = listCmd.command('site')
  .alias('s')
  .alias('sites')
  .action(listActions.listSiteAction);

const listSipPeerCmd = listCmd.command('sippeer <site-id>')
  .alias('p')
  .alias('sippeers')
	.alias('peer')
  .action(listActions.listSipPeerAction);

/**************************'DELETE' COMMAND**************************/

const deleteCmd = program.command('delete')
  .alias('d')
  .alias('del')
	.description('Delete a site, location, or sip peer.');

const deleteAppCmd = deleteCmd.command('app <app-id>')
  .alias('a')
  .alias('applicatiion')
  .action(deleteActions.deleteAppAction)

const deleteSiteCmd = deleteCmd.command('site <site-id>')
  .alias('s')
  .action(deleteActions.deleteSiteAction)

const deleteSipPeerCmd = deleteCmd.command('sippeer <args here>')
	.alias('p')
	.alias('peer')
	.requiredOption('-s, --siteId <siteId>', 'The id of the site under which a sip peer is located')
	.action(deleteActions.deleteSipPeerAction);
