const numbers = require("@bandwidth/numbers");
const printer = require('../printer')
const { BadInputError } = require('../errors');
const utils = require('../utils');
const validDefaults = ['sippeer', 'site', 'application'];


module.exports.defaultAction = async (defaultName, defaultValue, cmdObj) => {
  const opts = cmdObj.opts();
  const deleteDefault = opts.delete;
  if (!defaultName) {
    return listDefault();
  }
  if (!validDefaults.includes(defaultName)) {
    throw new BadInputError(`${defaultName} is not a valid default option.`, 'defaultName', 'valid default items include:\n' + validDefaults.join('\n'))
  }
  if (deleteDefault) {
    return deleteDefault(defaultName);
  }
  if (!defaultValue) {
    return getDefault(defaultName);
  }
  return setDefault(defaultName, defaultValue);


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
