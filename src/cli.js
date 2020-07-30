const { Command } = require('commander');
const actions = {
  ...require('./commands/code'),
  ...require('./commands/create'),
  ...require('./commands/default'),
  ...require('./commands/delete'),
  ...require('./commands/list'),
  ...require('./commands/login'),
  ...require('./commands/message'),
  ...require('./commands/order'),
  ...require('./commands/quickstart')
}
const { errorHandler } = require('./errors');

Object.keys(actions).map(function(key, index) {
  actions[key] = errorHandler(actions[key]);
});

module.exports.program = program = new Command();

const description = 'A CLI tool which fast-tracks first time users of bandwidth to be able to order numbers immediately with some setup.';
program
  .name('bandwidth')
  .version('0.0.1')
  .description(description);


/**************************'CODE' COMMAND**************************/
const codeCmd = program.command('code')
  .description('Generate pluggable sample programs that fit right into existing code.');

const codeCallbackServerCmd = codeCmd.command('callback-server')
  .alias('server')
  .description('Set up a server to receive callbacks on messages.')
  .option('-o, --out <destination>', 'The relative path to write the file to.')
  .option('-f, --force', 'Overwrite the existing file, if it exists.')
  .action(actions.codeCallbackServerAction)
  

/**************************'CREATE' COMMAND**************************/
const createCmd = program.command('create')
  .alias('c')
  .description('Create an organizational category for phone numbers, such as sip peers/locations, sites/sub-accounts, and applications.')

const createAppCmd = createCmd.command('app <name>')
  .alias('a')
  .alias('application')
  .requiredOption('-t, --type <type>', 'An application must be a voice(v) or messaging(m) application')
  .option('-c, --custom', 'Customize and specify optional details about your application.')
  .action(actions.createAppAction)

const createSiteCmd = createCmd.command('site <name>')
  .alias('s')
  .alias('subaccount')
  .alias('sub-account')
  .option('-c, --custom', 'Customize and specify optional details about your site, such as a customer name or a customer provided ID.')
  .requiredOption('-t, --address-type <type>', 'A site must be a billing(b) or service(s) application')
  .action(actions.createSiteAction)

const createSipPeerCmd = createCmd.command('sippeer <name>')
  .alias('p')
  .alias('peer')
  .alias('location')
  .option('-s, --site-id <site-id>', 'The id of the site to create a sippeer under')
  .option('-d, --default', "Specify that the peer is not the default peer of the sub account.")
  .option('-c, --custom', 'Customize and specify optional details about your sip peer.')
  .action(actions.createSipPeerAction)


/**************************'DEFAULT' COMMAND**************************/
const defaultCmd = program.command('default [default-name] [default-value]')
  .alias('def')
  .usage('[[-d] <default-name> [<default-value>]]')
  .option('-d, --delete', 'Delete specified defaultName.')
  .description('Manage which default items will be used by the CLI. If no arguments are called, then list all default items. If the name of a default item is given try to set that default to the new defaultValue.')
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
  .option('-v, --verbose', 'Increase output verbosity.')
  .action(actions.deleteAppAction)

const deleteSiteCmd = deleteCmd.command('site <site-id>')
  .alias('s')
  .option('-f, --force', 'Forcefully delete the site and all sip peers associated with the site')
  .option('-v, --verbose', 'Increase output verbosity.')
  .action(actions.deleteSiteAction)

const deleteSipPeerCmd = deleteCmd.command('sippeer <peer-id>')
  .alias('p')
  .alias('peer')
  .option('-s, --site-id <site-id>', 'The id of the site under which a sip peer is located')
  .option('-f, --force', 'Force delete the peer and associated numbers.')
  .option('-v, --verbose', 'Increase output verbosity.')
  .action(actions.deleteSipPeerAction);


/**************************'LIST' COMMAND**************************/
const listCmd = program.command('list')
  .alias('l')
  .description('List the sip peers, sites, and applications associated with your account, or phone numebers in the account.');


const listAppCmd = listCmd.command('app')
  .alias('a')
  .alias('apps')
  .alias('application')
  .alias('applications')
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

const listNumberCmd = listCmd.command('number <site-id> [peer-id]')
  .alias('n')
  .alias('tn')
  .alias('numbers')
  .option('-o, --out [destination]', "If no destination specified, prints to console. Otherwise, writes to the destination file (or 'stdout').")
  .action(actions.listNumberAction);

/**************************'LOGIN' COMMAND**************************/
const loginCmd = program.command('login')
  .description('Set up your Bandwidth cli by logging into your Bandwidth dashboard account.')
  .action(actions.loginAction)

/**************************'MESSAGE' COMMAND**************************/
const messageCmd = program.command('message <to-num...>')
  .description('Send a text message.')
  .option('-a, --app-id <id>', 'Send a message under this application id.')
  .option('-n, --from-num <num>', 'The number to send a message from.')
  .option('-q, --quiet', 'Suppress console output.')
  .action(actions.messageAction)

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
  .option('-c, --custom', 'Customize and specify optional details about the quickstart.')
  .action(actions.quickstartAction);


