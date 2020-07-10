const keytar = require('keytar');
const configPath = require('os').homedir() + '/' + '.bandwidth_cli';
const { CliError, BadInputError } = require('./errors');
const fs = require('fs');
const numbers = require('@bandwidth/numbers');
const printer = require('./printer');
const prompts = require('../assets/prompts');

const accIdKey = 'account_id';
const dashboardUserKey = 'dashboard_username';
const keytarKey = 'bandwidth_cli_dashboard';
const defaultKey = 'defaults';
const setupNumberKey = 'setup_number'; //My application 1, my application 2, etc. For avoiding confusion in quickstart.

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

/**
 * Returns an empty string the first time, and then 1, 2, 3... thereafter.
 * Used to avoid name clashes for the fixed names applied in quickstart.
 */
const incrementSetupNo = async() => {
  let setupNo = readConfig(setupNumberKey);
  setupNo = setupNo?setupNo+=1:0;
  writeConfig(setupNumberKey, setupNo);
  return setupNo || ''; //if 0, then nothing
}


const getDefaults = async () => {
  return (readConfig(defaultKey)||{});
}
const readDefault = async (defaultName) => {
  const config = readConfig(defaultKey);
  return (config||{})[defaultName];
}
/**
 * Sets the default.
 * @param quiet an optional param which, if truthy, will suppress overwritten warnings.
 */
const setDefault = async (defaultName, value, quiet) => {
  const defaults = readConfig(defaultKey) || {};
  if (defaults[defaultName] && !quiet) {
    printer.warn(`Default ${defaultName} is being overwritten from ${defaults[defaultName]}`);
  }
  defaults[defaultName] = value;
  writeConfig(defaultKey, defaults)
  return defaultName;
}
const deleteDefault = async (defaultName) => {
  const defaults = readConfig(defaultKey);
  if (!defaults[defaultName]) {
    throw new BadInputError(`No default ${defaultName} has been set`, 'defaultName', 'To see current default api settings, try "bandwidth default".')
  }
  delete defaults[defaultName];
  writeConfig(defaultKey, defaults);
  return defaultName;
}
/**
 * Takes in a default value and a default field. If the value is null, uses the default
 * and alerts the user. Returns undefined if the default is not set.
 */
const processDefault = async (field, value) => {
  if (value) {return value;}
  const defaultValue = await readDefault(field);
  if (defaultValue) {
    printer.print(`Using default ${field} ${defaultValue}`);
  }
  return defaultValue;
}

/**
 * Derives and teturns the appropriate order type from the list of attributes.
 */
const deriveOrderType = (numberAttributes) => {
  const orderTypeMap = {
    areaCode: 'areaCodeSearchAndOrderType',
    rateCenter: 'rateCenterSearchAndOrderType',
    npaNxx: 'NPANXXSearchAndOrderType',
    npaNxxX: 'NPANXXXSearchAndOrderType',
    state: 'stateSearchAndOrderType',
    city: 'citySearchAndOrderType',
    zip: 'ZIPSearchAndOrderType',
    lata: 'LATASearchAndOrderType'
  }
  if (numberAttributes.length === 0) {
    return undefined;
  }
  const withoutState = numberAttributes.filter(attribute => attribute !== 'state')
  if (withoutState.length === 0) { //state is the only one
    return orderTypeMap.state
  }
  if (withoutState.length === 1 && (withoutState.includes('rateCenter') || withoutState.includes('city'))) { //these require the state as well.
    return orderTypeMap[withoutState.pop()];
  }
  if (numberAttributes.length === 1) {
    return orderTypeMap[numberAttributes.pop()];
  }
  return 'combinedSearchAndOrderType'
}

const placeNumberOrder = async (phoneNumbers, siteId, peerId) => {
  if (!phoneNumbers.length) {return printer.error('You did not select any numbers and the order has been aborted.')}
  const truncated = (phoneNumbers.length - 20);
  phoneNumbers.slice(0, 20).forEach((phoneNumber) => {
    printer.print(phoneNumber)
  });
  printer.printIf(truncated > 0, `[and ${truncated} more]`)
  const answer = (await printer.prompt(prompts.confirmNumberOrder(phoneNumbers))).orderNumber;
  if (!answer){return;}
  var order = {
    name:"Bandwidth Cli Order",
    siteId: siteId,
    existingTelephoneNumberOrderType: {
      telephoneNumberList:[
        {
          telephoneNumber:phoneNumbers
        }
      ]
    }
  };
  const createdOrder = await numbers.Order.createAsync(order).then(orderResponse => orderResponse.order).catch(err => {throw new ApiError(err)});
  printer.success('Your order was placed. See the details of your order below.')
  printer.removeClient(createdOrder) // TODO: wait until the order worked/failed before posting?
}


module.exports = {
  saveDashboardCredentials,
  readDashboardCredentials,
  saveAccountId,
  readAccountId,
  getDefaults,
  readDefault,
  setDefault,
  deleteDefault,
  processDefault,
  incrementSetupNo,
  deriveOrderType,
  placeNumberOrder
}
