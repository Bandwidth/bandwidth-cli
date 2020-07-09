const numbers = require("@bandwidth/numbers");
const printer = require('../printer')
const { ApiError, BadInputError } = require('../errors');
const utils = require('../utils');

module.exports.orderNumberAction = async (number, cmdObj) => {
  const siteId = cmdObj.siteId || utils.readDefault('site');
  const peerId = cmdObj.peerId || utils.readDefault('sippeer');
  if (!siteId) {
    throw new BadInputError('A site id is required to create a number order', 'siteId', 'Specify a siteId using the --siteId option, or set a default using "bandwidth default site [siteId]"')
  }
  var order = {
    name:"Bandwidth Cli Order",
    siteId: siteId,
    existingTelephoneNumberOrderType: {
      telephoneNumberList:[
        {
          telephoneNumber:number
        }
      ]
    }
  };
  const createdOrder = await numbers.Order.createAsync(order).catch(err => {throw new ApiError(err)});
  printer.success('order placed successfully. See the details of your order below.')
  printer.removeClient(createdOrder)
}

module.exports.orderCategoryAction = async () => {
}

module.exports.orderSearchAction = async () => {
}
