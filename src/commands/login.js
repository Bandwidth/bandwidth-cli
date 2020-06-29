const numbers = require('@bandwidth/numbers');
const printer = require('../printer');
const utils = require('../utils');
const { ApiError, errorHandler } = require('../errors');

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
      message: "Please enter your Bandwidth dashboard username. This will be securely stored.",
      mask: '*'
    },
    {
      type: 'input',
      name: 'accountId',
      message: "Please enter your Bandwidth account ID."
    }
  ]
  const {username, password, accountId} = await printer.prompt(loginPrompts)
  await utils.saveAccountId(accountId);
  await utils.saveDashboardCredentials({
    username: username,
    password: password});
  printer.success('your credentials have been saved. You can now start using the CLI.')
}
