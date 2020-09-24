const numbers = require("@bandwidth/numbers");
const printer = require('../printer');
const { BadInputError, throwApiErr } = require('../errors');
const utils = require('../utils');
const apiutils = require("../apiutils");

module.exports.accountInfoAction = async () => {
  const accountInfo = await numbers.Account.getProductsAsync();
  var tableOutput = [];
  accountInfo.product.forEach(product => {
    var objectToPush = {};
    objectToPush.name = product.name;
    if (Array.isArray(product.features.feature)) {
      objectToPush.features = product.features.feature.join(", ");
    } else {
      objectToPush.features = product.features.feature;
    }
    tableOutput.push(objectToPush);
    //printer.print(`Product: ${product.name}, Features: ${product.features.feature}`);
  });
  printer.table(tableOutput, {
    fields: ['name', 'features'],
    key: 'name'
  });
}
