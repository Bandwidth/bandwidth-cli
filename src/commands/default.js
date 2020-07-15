const numbers = require("@bandwidth/numbers");
const printer = require('../printer')
const { BadInputError } = require('../errors');
const utils = require('../utils');
const validDefaults = ['sippeer', 'site', 'application']; //FIXME default voice and default messaging apps should be different.


module.exports.defaultAction = async (defaultField, defaultValue, cmdObj) => {
  const opts = cmdObj.opts();
  const deleteDefault = opts.delete;
  //No args -> list defaults
  if (!defaultField) {
    const defaults = await utils.getDefaults();
    return (Object.keys(defaults).length)?
    printer.printObj(defaults):
    printer.print('No defaults have been set. To set a default api setting, use "bandwidth default <default-field> <default-value>"')
  }
  //Default not in the list of allowed defaults
  if (!validDefaults.includes(defaultField)) {
    throw new BadInputError(`${defaultField} is not a valid default option.`, 'defaultField', 'valid default items include:\n' + validDefaults.join('\n'))
  }
  //delete switch overrides setting the value
  if (deleteDefault) {
    const deletedField = await utils.deleteDefault(defaultField);
    if (defaultField === 'site') {
      await utils.deleteDefault('sippeer');
      printer.warn(`Default sippeer deleted under the site`)
    }
    return printer.print(`Default ${deletedField} deleted`)
  }
  //no delete switch but not setting a default value
  if (!defaultValue) {
    const retrievedDefault = await utils.readDefault(defaultField);
    if (retrievedDefault) {
      return printer.print(await utils.readDefault(defaultField));
    }
    return printer.warn(`Default ${defaultValue} not set.`)
  }
  //set default value
  const setName = await utils.setDefault(defaultField, defaultValue);
  return printer.print(`Default ${setName} set.`)
}
