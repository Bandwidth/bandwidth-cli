const numbers = require('@bandwidth/numbers');
const printer = require('../printer');
const utils = require('../utils');
const { ApiError, BadInputError} = require('../errors');

module.exports.loginAction = async () => {//FIXME
  const loginPrompts = [ //possible add "advanced" creating for other fields?
    {
      type: 'input',
      name: 'username',
      message: "Please enter your Bandwidth dashboard username"
    },
    {
      type: 'password',
      name: 'password',
      message: "Please enter your Bandwidth dashboard password. This will be securely stored.",
      mask: '*'
    },
    {
      type: 'input',
      name: 'accountId',
      message: "Please enter your Bandwidth account ID."
    }
  ]
  printer.print('Leaving a field blank will keep it at its previous value.')
  const {username, password, accountId} = await printer.prompt(loginPrompts)
  if (!(username || password || accountId)) {
    return printer.warn('No credentials were entered and the login has been aborted.')
  }
  await utils.saveAccountId(accountId);
  if (! await utils.readAccountId()) {
    throw new BadInputError('An account ID is required if none is currently set.');
  }
  await utils.saveDashboardCredentials({
    username: username,
    password: password});
  printer.success('Your credentials have been saved. You can now start using the CLI.')
}
