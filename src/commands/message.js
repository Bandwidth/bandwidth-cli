const BandwidthMessaging = require('@bandwidth/messaging');
const printer = require('../printer');
const utils = require('../utils');
const { BadInputError } = require('../errors');

module.exports.messageAction = async (toNum, cmdObj) => {
  const opts = cmdObj.opts();
  const quiet = opts.quiet;
  const creds = await utils.readDashboardCredentials();
  BandwidthMessaging.Configuration.basicAuthUserName = creds.username 
  BandwidthMessaging.Configuration.basicAuthPassword = creds.password; 
  const accId = await utils.readAccountId();
  const fromNum = await utils.processDefault('number', opts.fromNum, quiet);
  const application = await utils.processDefault('messageApp', opts.application, quiet);
  if (!fromNum) {
    throw new BadInputError('No "from" number was specified.', 'fromNum', 'Specify a number with "bandwidth message 12345678 --from-num 12345", or set a default with "bandwidth default number 12345"');
  }
  const text = (await printer.prompt('message')).message
  const body = new BandwidthMessaging.MessageRequest({
    applicationId: application,
    to : toNum,
    from : fromNum,
    text : text
  });
  const response = await BandwidthMessaging.APIController.createMessage(accId, body).catch(err => {printer.error(err.errorMessage)});
  if (quiet) {
    return printer.success('Message request placed.')
  }
  printer.success('Message request placed. The following information passed to server:');
  printer.printObj(response)
  printer.warn('Warning: The message is not necessarily delivered. Callback information about the text should be accessed via a server. Set up a server for your default application with "bandwidth code server".')
}
