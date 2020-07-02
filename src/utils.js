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
  const defaults = readConfig('defaults');
  (Object.keys(defaults).length)?
  printer.printObj(readConfig('defaults')):
  printer.print('No defaults have been set. To set a default api setting, use "bandwidth default <default-name> <default-value>"')
}
const getDefault = async (defaultName) => {
  printer.print(readConfig('defaults')[defaultName])
}
const setDefault = async (defaultName, value) => {
  const defaults = readConfig('defaults');
  if (defaults[defaultName]) {
    printer.warn(`Default ${defaultName} is being overwritten from ${defaults[defaultName]}`);
  }
  defaults[defaultName] = value;
  writeConfig('defaults', defaults)
  return printer.print(`Default ${defaultName} set.`)
}
const deleteDefault = async (defaultName) => {
  const defaults = readConfig('defaults');
  if (!defaults[defaultName]) {
    throw new BadInputError(`No default ${defaultName} has been set`, 'defaultName', 'To see current default api settings, try "bandwidth default".')
  }
  delete defaults[defaultName];
  writeConfig('defaults', defaults)
  return printer.print(`Default ${defaultName} deleted`)
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
