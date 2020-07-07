const keytar = require('keytar');
const configPath = require('os').homedir() + '/' + '.bandwidth_cli';
const { CliError, BadInputError } = require('./errors');
const fs = require('fs');
const numbers = require('@bandwidth/numbers');
const accIdKey = 'account_id';
const dashboardUserKey = 'dashboard_username';
const keytarKey = 'bandwidth_cli_dashboard';

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
    return undefined;
  }
}
const saveDashboardCredentials = async ({username, password}) => {
  const oldCredentials = await readDashboardCredentials();
  username = username || oldCredentials.username;
  password = password || oldCredentials.password
  if (!username || !password) {
    throw new BadInputError('both a username and a password must be set.')
  }
  if (oldCredentials.username) {
    await keytar.deletePassword(keytarKey, oldCredentials.username);
  }
  writeConfig(dashboardUserKey, username)
  await keytar.setPassword(keytarKey, username, password);
}

const readDashboardCredentials = async () => {
  const username = readConfig(dashboardUserKey);
  if (!username) {
    return {username: undefined, password: undefined}
  }
  const password = await keytar.getPassword(keytarKey, username);
  return {username, password};
}

const saveAccountId = async (accId) => {
  if (accId) {
    writeConfig(accIdKey, accId);
  }
}

const readAccountId = async () => {
  return readConfig(accIdKey);
}

module.exports = {
  saveDashboardCredentials,
  readDashboardCredentials,
  saveAccountId,
  readAccountId
}
