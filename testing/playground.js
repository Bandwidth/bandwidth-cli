//A Free-for-all playground to run code without changing things, hopefully.



const { deleteApplication, createSippeer, listSippeers, geocode, createSite, deleteSite, deleteSippeer } = require('../api-utils');
geocode('900 Main Campus dr', 'Raleigh', 'NC', '27606').then(address => createSippeer({
  siteId: 35593,
  name: "testpeerName5",
  description: "helloworld description",
  isDefault: false,
  address: address,
  addressType: 'billing',
})).then(console.log).catch(err => {console.log(err)})
