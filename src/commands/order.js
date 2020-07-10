const numbers = require("@bandwidth/numbers");
const printer = require('../printer')
const { ApiError, BadInputError } = require('../errors');
const prompts = require('../../assets/prompts');
const utils = require('../utils');

module.exports.orderNumberAction = async (phoneNumbers, cmdObj) => {
  const options = cmdObj.opts();
  const siteId = options.siteId || await utils.readDefault('site');
  const peerId = options.peerId || (!options.siteId)?await utils.readDefault('sippeer'):undefined; //defined siteId but not peer means that the default peer won't work, since it's linked to a site.
  if (!siteId) { //a lot of this violates DRY.
    throw new BadInputError('A site id is required to create a number order', 'siteId', 'Specify a siteId using the --siteId option, or set a default using "bandwidth default site [siteId]"')
  }
  await utils.placeNumberOrder(phoneNumbers, siteId, peerId);
}

module.exports.orderCategoryAction = async (quantity, cmdObj) => {
  const options = cmdObj.opts();
  const siteId = options.siteId || await utils.readDefault('site');
  const peerId = options.peerId || (!options.siteId)?await utils.readDefault('sippeer'):undefined;
  if (!siteId) {
    throw new BadInputError('A site id is required to create a number order', 'siteId', 'Specify a siteId using the --siteId option, or set a default using "bandwidth default site [siteId]"')
  }
  const query = {...options}
  delete query.siteId;
  delete query.peerId;
  const numberAttributes = Object.entries(query).filter(([key, value]) => value).map(([key, value]) => key);//keys with truthy values
  const orderType = utils.deriveOrderType(numberAttributes);
  var order = {
    name:"Bandwidth Quickstart Order",
    siteId: siteId,
    peerId: peerId
  };
  query.quantity = quantity;
  order[orderType] = query
  const createdOrder = await numbers.Order.createAsync(order).then(orderResponse => orderResponse.order).catch(err => {throw new ApiError(err)});
  printer.success('Your order was placed. See the details of your order below.')
  printer.removeClient(createdOrder) // TODO: wait until the order worked/failed before posting?
}

module.exports.orderSearchAction = async (quantity, cmdObj) => {
  const options = cmdObj.opts();
  const siteId = options.siteId || await utils.readDefault('site');
  const peerId = options.peerId || (!options.siteId)?await utils.readDefault('sippeer'):undefined;
  if (!siteId) {
    throw new BadInputError('A site id is required to create a number order', 'siteId', 'Specify a siteId using the --siteId option, or set a default using "bandwidth default site [siteId]"')
  }
  const query = {...options, quantity}
  delete query.siteId;
  delete query.peerId;
  const results = await numbers.AvailableNumbers.listAsync(query).catch(err => {throw new ApiError(err)});
  let selected;
  if (results.resultCount === 0) {
    printer.custom('yellow', 1, warn)('No numbers were found. Check your query parameters.')
  } else if (results.resultCount === 1) {
    selected = results.telephoneNumberList.telephoneNumber
  } else {
    selected = (await printer.prompt('orderNumberSelection', results.telephoneNumberList.telephoneNumber)).orderNumberSelection
  }
  await utils.placeNumberOrder(selected, siteId, peerId);
}
