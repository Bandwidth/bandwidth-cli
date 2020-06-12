//A Free-for-all playground to run code without changing things, hopefully.



const { deleteApplication, createSippeer, listSippeers, geocode, createSite, deleteSite, deleteSippeer } = require('../api-utils');
geocode('900 Main Campus dr', 'Raleigh', 'NC', '27606').then(address => createSite({
  name: "testname",
  address: address,
  addressType: "Billing",
})).then((asdf) => console.log(asdf)).catch(console.log)
