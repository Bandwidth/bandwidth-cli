const { Command } = require('commander');
const numbers = require("@bandwidth/numbers");
const inquirer = require('inquirer');
const actions = {
  ...require('./commands/create'),
  ...require('./commands/default'),
  ...require('./commands/delete'),
  ...require('./commands/list'),
  ...require('./commands/login'),
  ...require('./commands/order'),
  ...require('./commands/quickstart')
}
const { errorHandler } = require('./errors');

Object.keys(actions).map(function(key, index) {
  actions[key] = errorHandler(actions[key]);
});

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
  .requiredOption('-t, --address-type <type>', 'A site must be a billing(b) or service(s) application')
  .action(actions.createSiteAction)

const createSipPeerCmd = createCmd.command('sippeer <name>')
  .alias('p')
  .alias('peer')
  .option('-s, --siteId <siteId>', 'The id of the site to create a sippeer under')
  .option('-d, --default', "Specify that the peer is not the default peer of the sub account.")
  .action(actions.createSipPeerAction)


/**************************'DEFAULT' COMMAND**************************/
const defaultCmd = program.command('default [default-name] [default-value]')
  .alias('def')
  .usage('[[-d] <default-name> [<default-value>]]')
  .option('-d, --delete', 'Delete specified defaultName.')
  .description('Manage default API items. If no arguments are called, then list all default items. If the name of a default item is given try to set that default to the new defaultValue.')
  .action(actions.defaultAction)


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

const deleteSipPeerCmd = deleteCmd.command('sippeer <peer-id>')
  .alias('p')
  .alias('peer')
  .option('-s, --siteId <siteId>', 'The id of the site under which a sip peer is located')
  .action(actions.deleteSipPeerAction);


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

const listSipPeerCmd = listCmd.command('sippeer [site-id]')
  .alias('p')
  .alias('sippeers')
  .alias('peer')
  .action(actions.listSipPeerAction);


/**************************'LOGIN' COMMAND**************************/
const loginCmd = program.command('login')
  .description('Set up your Bandwidth cli by logging into your Bandwidth dashboard account.')
  .action(actions.loginAction)


/**************************'ORDER' COMMAND**************************/
const orderCmd = program.command('order')
  .alias('o')
  .description('Order phone numbers.');

const orderNumberCmd = orderCmd.command('number <phone-numbers...>')
  .alias('n')
  .alias('numbers')
  .alias('no')
  .alias('nos')
  .option('-s, --site-id <site-id>', "Specify a site id to order a number with, using its id.")
  .option('-p, --peer-id <peer-id>', "Specify a sip peer to order a number with, using its id.")
  .description('Order a specific list of phone numbers.')
  .action(actions.orderNumberAction);

const orderCategoryCmd = orderCmd.command('category <quantity>')
  .alias('c')
  .alias('categories')
  .option('--zip <zip-code>', "Order numbers by zip code.")
  .option('--area-code <area-code>', "Order numbers by area code.")
  .option('--npa-nxx <npa-nxx>', "Order numbers by the first 6 digits. eg 123456 -> (123)-456-xxxx")
  .option('--npa-nxx-x <npa-nxx-x>', "Order numbers by the first 7 digits. eg 1234567 -> (123)-456-7xxx")
  .option('--state <state-code>', "Order numbers by state")
  .option('--city <city>', "Order numbers by city.")
  .option('--lata <lata>', "Order numbers by LATA (Local Access and Transport Area).")
  .option('-s, --site-id <site-id>', "Specify a site id to order a number with, using its id.")
  .option('-p, --peer-id <peer-id>', "Specify a sip peer to order a number with, using its id.")
  .description('Order phone numbers based on categories, such as area code, zip codes, cities, and states. Use options to specify their values, and specify how many through the argument.')
  .action(actions.orderCategoryAction);

const orderSearchCmd = orderCmd.command('search <quantity>')
  .alias('s')
  .option('--zip <zip-code>', "Order numbers by zip code.")
  .option('--area-code <area-code>', "Order numbers by area code.")
  .option('--npa-nxx <npa-nxx>', "Order numbers by the first 6 digits. eg 123456 -> (123)-456-xxxx")
  .option('--npa-nxx-x <npa-nxx-x>', "Order numbers by the first 7 digits. eg 1234567 -> (123)-456-7xxx")
  .option('--state <state-code>', "Order numbers by state")
  .option('--city <city>', "Order numbers by city.")
  .option('--lata <lata>', "Order numbers by LATA (Local Access and Transport Area).")
  .option('-s, --site-id <site-id>', "Specify a site id to order a number with, using its id.")
  .option('-p, --peer-id <peer-id>', "Specify a sip peer to order a number with, using its id.")
  .description("Search phone numbers through categories such as area code, zip codes, cities, and states, and choose numbers that you'd like to order.")
  .action(actions.orderSearchAction);


/**************************'QUICKSTART' COMMAND**************************/
const quickstartCmd = program.command('quickstart')
  .option('-v, --verbose', 'List out the steps that are being set.')
  .action(actions.quickstartAction);
