const { Command } = require('commander');
const numbers = require("@bandwidth/numbers");
const inquirer = require('inquirer');
const { ApiError, errorHandler } = require('./errors');
const actions = {
  ...require('./commands/create'),
  ...require('./commands/delete'),
  ...require('./commands/list'),
  ...require('./commands/default')
}
Object.keys(actions).map(function(key, index) {
  actions[key] = errorHandler(actions[key]);
});
numbers.Client.globalOptions.accountId = process.env.BANDWIDTH_ACCOUNT_ID;
numbers.Client.globalOptions.userName = process.env.BANDWIDTH_API_USER;
numbers.Client.globalOptions.password = process.env.BANDWIDTH_API_PASSWORD;



module.exports.program = program = new Command();

const description = 'A descriptive description to describe something worth describing with a description.';
program
  .name('bandwidth')
  .version('0.0.1')
  .description(description);

/**************************'CREATE' COMMAND**************************/

const createCmd = program.command('create')
  .alias('c')
  .description('Create an organizational category for phone numbers, such as sip peers/locations, sites/sub-accounts, and applications.')

const createAppCmd = createCmd.command('app <name>')
  .alias('a')
  .requiredOption('-t, --type <type>', 'An application must be a voice(v) or messaging(m) application')
  .action(actions.createAppAction)

const createSiteCmd = createCmd.command('site <name>')
  .alias('s')
  .requiredOption('-t, --addressType <type>', 'A site must be a billing(b) or service(s) application')
  .action(actions.createSiteAction)

const createSipPeerCmd = createCmd.command('sippeer <name>')
  .alias('p')
  .alias('peer')
  .requiredOption('-s, --siteId <siteId>', 'The id of the site to create a sippeer under')
  .option('-d, --default', "Determines whether the sip peer is the default peer of the sub account.")
  .action(actions.createSipPeerAction)


/**************************'LIST' COMMAND**************************/

const listCmd = program.command('list')
  .alias('l')
  .description('List the sip peers, sites, and applications associated with your account.');


const listAppCmd = listCmd.command('app')
  .alias('a')
  .alias('apps')
  .action(actions.listAppAction);

const listSiteCmd = listCmd.command('site')
  .alias('s')
  .alias('sites')
  .action(actions.listSiteAction);

const listSipPeerCmd = listCmd.command('sippeer <site-id>')
  .alias('p')
  .alias('sippeers')
  .alias('peer')
  .action(actions.listSipPeerAction);

/**************************'DELETE' COMMAND**************************/

const deleteCmd = program.command('delete')
  .alias('d')
  .alias('del')
  .description('Delete a site, location, or sip peer.');

const deleteAppCmd = deleteCmd.command('app <app-id>')
  .alias('a')
  .alias('applicatiion')
  .option('-f, --force', 'Delete the application even if it has sippeers by automatically unlinking all sip peers associated with the application')
  .action(actions.deleteAppAction)

const deleteSiteCmd = deleteCmd.command('site <site-id>')
  .alias('s')
  .option('-f, --force', 'Delete the site even if it has sippeers by automatically delete all sip peers associated with the site')
  .action(actions.deleteSiteAction)

const deleteSipPeerCmd = deleteCmd.command('sippeer <args here>')
  .alias('p')
  .alias('peer')
  .requiredOption('-s, --siteId <siteId>', 'The id of the site under which a sip peer is located')
  .action(actions.deleteSipPeerAction);

/**************************'DEFAULT' COMMAND**************************/
const defaultCmd = program.command('default [default-name] [default-value]')
  .alias('def')
  .usage('[[-d] <default-name>] [<default-value>]')
  .option('-d, --delete', 'Delete specified defaultName.')
  .description('Manage default API items. If no arguments are called, then list all default items. If the name of a default item is given try to set that default to the new defaultValue.')
  .action(actions.defaultAction)
