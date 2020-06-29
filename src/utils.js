const keytar = require('keytar');
const configPath = require('os').homedir() + '/' + '.bandwidth_cli';
const { CliError, BadInputError } = require('./errors');
const fs = require('fs');
const numbers = require('@bandwidth/numbers');

const writeConfig = (config, value) => {
  let mapping;
  try {
    mapping = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  } catch (err) {
    mapping = {}
  }
  mapping[config] = value;
  fs.writeFileSync(configPath, JSON.stringify(mapping));
}
const readConfig = (config) => {
  try {
    mapping = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    return mapping[config];
  } catch (err) {
    throw new BadInputError(`Unable to read config '${config}'. Check that you have configured it correctly.`, config);
  }
}
const saveDashboardCredentials = async ({username, password}) => {
  const oldCredentials = await readDashboardCredentials();
  username = username || oldCredentials.username;
  password = password || oldCredentials.password
  if (!username || !password) {
    throw new BadInputError('both a username and a password must be set.')
  }
  await keytar.deletePassword('bandwidth_cli_dashboard', oldCredentials.username);
  await keytar.setPassword('bandwidth_cli_dashboard', username, password);
}

const readDashboardCredentials = async () => {
  const username = readConfig('dashboard username');
  const password = await keytar.getPassword('bandwidth_cli_dashboard', username);
  return {username, password};
}

const saveAccountId = async (accId) => {
  if (accId) {
    writeConfig('account id', accId);
  }
}

const readAccountId = async () => {
  return readConfig('account id');
}

module.exports = {
  saveDashboardCredentials,
  readDashboardCredentials,
  saveAccountId,
  readAccountId
}
