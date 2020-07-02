const keytar = require('keytar');
const configPath = require('os').homedir() + '/' + '.bandwidth_cli';
const { CliError, BadInputError } = require('./errors');
const fs = require('fs');
const numbers = require('@bandwidth/numbers');
const printer = require('./printer')

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
    await keytar.deletePassword('bandwidth_cli_dashboard', oldCredentials.username);
  }
  writeConfig('dashboard username', username)
  await keytar.setPassword('bandwidth_cli_dashboard', username, password);
}

const readDashboardCredentials = async () => {
  const username = readConfig('dashboard username');
  if (!username) {
    return {username: undefined, password: undefined}
  }
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



const listDefault = async () => {
  printer.print('sdf')
}
const getDefault = async (defaultName) => {
}
const setDefault = async (defaultName, value) => {
}
const deleteDefault = async (defaultName) => {
}


module.exports = {
  saveDashboardCredentials,
  readDashboardCredentials,
  saveAccountId,
  readAccountId,
  defaultUtils: {
    listDefault,
    getDefault,
    setDefault,
    deleteDefault
  }
}