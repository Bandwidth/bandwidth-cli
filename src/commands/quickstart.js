const numbers = require("@bandwidth/numbers");
const printer = require('../printer');
const { ApiError, BadInputError } = require('../errors')
const utils = require('../utils')


module.exports.quickstartAction = async () => {
  printer.print('An address is required for this quickstart.');
  const sitePrompts = [
    {
      type: 'input',
      name: 'addressLine1',
      message: "Please enter address line 1. (example: 900 Main Campus Dr)"
    },
    {
      type: 'input',
      name: 'addressLine2',
      message: "Please enter the city, state, and ZIP, each seperated by a comma and a space. (example: Raleigh, NC, 27606)"
    }
  ]
  const answers = await printer.prompt(sitePrompts);
  const line2 = answers.addressLine2.split(', ');
  const address = await numbers.Geocode.requestAsync({
    addressLine1: answers.addressLine1,
    city: line2[0],
    stateCode: line2[1],
    zip: line2[2]
  }).catch((err) => {throw new ApiError(err)});
  printer.print('Address validated.')
  const createdSite = await numbers.Site.createAsync({
    name: 'My Site',
    address: {
      ...address,
      addressType: 'billing',//doesn't matter, so I just chose one and went with it.
    }
  }).catch((err) => {throw new ApiError(err)});
  printer.success(`Site created with id ${createdSite.id}`)
  
}
