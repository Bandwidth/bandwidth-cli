const numbers = require("@bandwidth/numbers");
const printer = require('../printer')
const { ApiError, BadInputError } = require('../errors');
const utils = require('../utils');

module.exports.orderNumberAction = async (phoneNumbers, cmdObj) => {
  const options = cmdObj.opts();
  const siteId = options.siteId || await utils.readDefault('site');
  const peerId = options.peerId || (!options.siteId)?await utils.readDefault('sippeer'):undefined; //defined siteId but not peer means that the default peer won't work, since it's linked to a site.
  if (!siteId) {
    throw new BadInputError('A site id is required to create a number order', 'siteId', 'Specify a siteId using the --siteId option, or set a default using "bandwidth default site [siteId]"')
  }
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

module.exports.orderCategoryAction = async (quantity, cmdObj) => {
  const options = cmdObj.opts();
  const siteId = options.siteId || await utils.readDefault('site');
  const peerId = options.peerId || (!options.siteId)?await utils.readDefault('sippeer'):undefined;
  if (!siteId) {
    throw new BadInputError('A site id is required to create a number order', 'siteId', 'Specify a siteId using the --siteId option, or set a default using "bandwidth default site [siteId]"')
  }
  const numberAttributes = Object.entries(options).filter(([key, value]) => value && !['siteId', 'peerId'].includes(key)).map(([key, value]) => key);
  const orderType = utils.deriveOrderType(numberAttributes);
  var order = {
    name:"Bandwidth Quickstart Order",
    siteId: siteId,
    peerId: peerId
  };
  console.log(orderType);
  order[orderType] = {}
}

module.exports.orderSearchAction = async () => {
}
