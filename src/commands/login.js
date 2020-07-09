const numbers = require('@bandwidth/numbers');
const printer = require('../printer');
const utils = require('../utils');
const prompts = require('../../assets/prompts.json');
const { ApiError, BadInputError} = require('../errors');

module.exports.loginAction = async () => {
  printer.print('Leaving a field blank will keep it at its previous value.')
  const {username, password, accountId} = await printer.prompt(prompts.loginPrompts)
  if (!(username || password || accountId)) {
    return printer.warn('No credentials were entered and the login has been aborted.')
  }
  await utils.saveAccountId(accountId);
  if (!await utils.readAccountId()) {
    throw new BadInputError('An account ID is required if none is currently set.');
  }
  await utils.saveDashboardCredentials({
    username: username,
    password: password});
  printer.success('Your credentials have been saved. You can now start using the CLI.')
}
