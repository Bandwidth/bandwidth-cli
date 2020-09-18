const printer = require('../printer');
const utils = require('../utils');
const { BadInputError } = require('../errors');
const numbers = require("@bandwidth/numbers");

module.exports.loginAction = async () => {
  printer.print('Leaving a field blank will keep it at its previous value.')
  const {username, password, accountId} = await printer.prompt(['username', 'password', 'accountId'])
  if (!(username || password || accountId)) {
    return printer.warn('No credentials were entered and the login has been aborted.')
  }
  const client = new numbers.Client(accountId, username, password);
  numbers.Account.getAsync(client).catch((err) => {
    if (err.status === 401) {
      throw new BadInputError('Account authentication failed and your credentials have not been saved. Please try again.')
    }
  })
  await utils.saveAccountId(accountId);
  if (!await utils.readAccountId()) {
    throw new BadInputError('An account ID is required if none is currently set.');
  }
  await utils.saveDashboardCredentials({
    username: username,
    password: password});
  printer.success("Your credentials have been saved.");
  printer.print('First time using Bandwidth? Try to "bandwidth quickstart" command to quickly get set up.')
}
