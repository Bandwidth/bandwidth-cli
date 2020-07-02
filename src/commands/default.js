const numbers = require("@bandwidth/numbers");
const printer = require('../printer')
const { BadInputError } = require('../errors');
const utils = require('../utils');
const validDefaults = ['sippeer', 'site', 'application'];


module.exports.defaultAction = async (defaultName, defaultValue, cmdObj) => {
  const opts = cmdObj.opts();
  const deleteDefault = opts.delete;
  if (!defaultName) {
    const defaults = await utils.getDefaults();
    return (Object.keys(defaults).length)?
    printer.table(defaults):
    printer.print('No defaults have been set. To set a default api setting, use "bandwidth default <default-name> <default-value>"')
  }
  if (!validDefaults.includes(defaultName)) {
    throw new BadInputError(`${defaultName} is not a valid default option.`, 'defaultName', 'valid default items include:\n' + validDefaults.join('\n'))
  }
  if (deleteDefault) {
    const deletedName = await utils.deleteDefault(defaultName);
    return printer.print(`Default ${deletedName} deleted`)
  }
  if (!defaultValue) {
    return printer.print(await utils.readDefault(defaultName));
  }
  const setName = await utils.setDefault(defaultName, defaultValue);
  return printer.print(`Default ${setName} set.`)
}
