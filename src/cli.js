const { Command } = require('commander');
const numbers = require("@bandwidth/numbers");
const inquirer = require('inquirer');
const createActions = require('./commands/create');
const deleteActions = require('./commands/delete');
const listActions = require('./commands/list');
const { loginAction } = require('./commands/login');
const { ApiError, errorHandler } = require('./errors');
const utils = require('./utils');

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
  .action(errorHandler(createActions.createAppAction))

const createSiteCmd = createCmd.command('site <name>')
  .alias('s')
  .requiredOption('-t, --addressType <type>', 'A site must be a billing(b) or service(s) application')
  .action(errorHandler(createActions.createSiteAction))

const createSipPeerCmd = createCmd.command('sippeer <name>')
  .alias('p')
  .alias('peer')
  .requiredOption('-s, --siteId <siteId>', 'The id of the site to create a sippeer under')
  .option('-d, --default', "Determines whether the sip peer is the default peer of the sub account.")
  .action(errorHandler(createActions.createSipPeerAction))


/**************************'LIST' COMMAND**************************/

const listCmd = program.command('list')
  .alias('l')
  .description('List the sip peers, sites, and applications associated with your account.');


const listAppCmd = listCmd.command('app')
  .alias('a')
  .alias('apps')
  .action(errorHandler(listActions.listAppAction));

const listSiteCmd = listCmd.command('site')
  .alias('s')
  .alias('sites')
  .action(errorHandler(listActions.listSiteAction));

const listSipPeerCmd = listCmd.command('sippeer <site-id>')
  .alias('p')
  .alias('sippeers')
  .alias('peer')
  .action(errorHandler(listActions.listSipPeerAction));

/**************************'DELETE' COMMAND**************************/

const deleteCmd = program.command('delete')
  .alias('d')
  .alias('del')
  .description('Delete a site, location, or sip peer.');

const deleteAppCmd = deleteCmd.command('app <app-id>')
  .alias('a')
  .alias('applicatiion')
  .option('-f, --force', 'Delete the application even if it has sippeers by automatically unlinking all sip peers associated with the application')
  .action(errorHandler(deleteActions.deleteAppAction))

const deleteSiteCmd = deleteCmd.command('site <site-id>')
  .alias('s')
  .option('-f, --force', 'Delete the site even if it has sippeers by automatically delete all sip peers associated with the site')
  .action(errorHandler(deleteActions.deleteSiteAction))

const deleteSipPeerCmd = deleteCmd.command('sippeer <args here>')
  .alias('p')
  .alias('peer')
  .requiredOption('-s, --siteId <siteId>', 'The id of the site under which a sip peer is located')
  .action(errorHandler(deleteActions.deleteSipPeerAction));

/**************************'Log in' COMMAND**************************/

const loginCmd = program.command('login')
  .description('Set up your Bandwidth cli by logging into your Bandwidth dashboard account.')
  .action(errorHandler(loginAction))
