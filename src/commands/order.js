const numbers = require("@bandwidth/numbers");
const printer = require('../printer')
const { BadInputError, throwApiErr } = require('../errors');
const utils = require('../utils');
const apiutils = require('../apiutils');

module.exports.orderNumberAction = async (phoneNumbers, cmdObj) => {
  const options = cmdObj.opts();
  const siteId = options.siteId || await utils.readDefault('site');
  const peerId = options.peerId || (!options.siteId) ? await utils.readDefault('sippeer') : undefined; //defined siteId but not peer means that the default peer won't work, since it's linked to a site.
  if (!siteId) { //a lot of this violates DRY.
    throw new BadInputError('A site id is required to create a number order', 'siteId', 'Specify a siteId using the --site-id option, eg "bandwidth order search --site-id=<siteId> <quantity>, or set a default using "bandwidth default site [siteId]"')
  }
  await apiutils.placeNumberOrder(phoneNumbers, siteId, peerId);
}

module.exports.orderCategoryAction = async (quantity, cmdObj) => {
  const options = cmdObj.opts();
  const siteId = options.siteId || await utils.readDefault('site');
  const peerId = options.peerId || (!options.siteId) ? await utils.readDefault('sippeer') : undefined;
  if (!siteId) {
    throw new BadInputError('A site id is required to create a number order', 'siteId', 'Specify a siteId using the --site-id option, eg "bandwidth order category --site-id=<siteId> <quantity>", or set a default using "bandwidth default site [siteId]"')
  }
  const query = { ...options }
  delete query.siteId;
  delete query.peerId;
  const numberAttributes = Object.entries(query).filter(([key, value]) => value).map(([key, value]) => key);//keys with truthy values
  const orderType = utils.deriveOrderType(numberAttributes);
  if (!orderType) {
    throw new BadInputError('Order parameters are required. Please specify at least one order, such as area code or zip.', 'orderType', 'To set an areacode or state, try "bandwidth order category --state [state-code] --area-code [area code] [quantity]"')
  }
  await apiutils.placeCategoryOrder(quantity, orderType, query, siteId, peerId)
}

module.exports.orderSearchAction = async (quantity, cmdObj) => {
  const options = cmdObj.opts();
  const siteId = options.siteId || await utils.readDefault('site');
  const peerId = options.peerId || (!options.siteId) ? await utils.readDefault('sippeer') : undefined;
  if (!siteId) {
    throw new BadInputError('A site id is required to create a number order', 'siteId', 'Specify a siteId using the --site-id option, eg "bandwidth order search --site-id=<siteId> <quantity>", or set a default using "bandwidth default site [siteId]"');
  }
  const query = { ...options, quantity }
  delete query.siteId;
  delete query.peerId;
  const results = await numbers.AvailableNumbers.listAsync(query).catch(throwApiErr);
  let selected;
  if (results.resultCount === 0 || Object.entries(results).length === 0) {
    printer.custom('yellow', 1, 'warn')('No numbers were found. Check your query parameters for typos or try other parameters.')
  } else if (results.resultCount === 1) {
    selected = [results.telephoneNumberList.telephoneNumber]
  } else {
    selected = (await printer.prompt('orderNumberSelection', results.telephoneNumberList.telephoneNumber)).orderNumberSelection
  }
  await apiutils.placeNumberOrder(selected, siteId, peerId);
}
