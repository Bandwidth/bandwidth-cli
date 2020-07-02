const numbers = require("@bandwidth/numbers");
const printer = require('../printer')
const { BadInputError } = require('../errors');
const utils = require('../utils').defaultUtils;
const validDefaults = ['sippeer', 'site', 'application'];


module.exports.defaultAction = async (defaultName, defaultValue, cmdObj) => {
  const opts = cmdObj.opts();
  const deleteDefault = opts.delete;
  if (!defaultName) {
    return utils.listDefault();
  }
  if (!validDefaults.includes(defaultName)) {
    throw new BadInputError(`${defaultName} is not a valid default option.`, 'defaultName', 'valid default items include:\n' + validDefaults.join('\n'))
  }
  if (deleteDefault) {
    return utils.deleteDefault(defaultName);
  }
  if (!defaultValue) {
    return utils.getDefault(defaultName);
  }
  return utils.setDefault(defaultName, defaultValue);
}
