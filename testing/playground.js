//A Free-for-all playground to run code without changing things, hopefully.



const { createSippeer, listSippeers, geocode, createSite } = require('../api-utils');
//listSippeers(35593)
geocode('904 E Anson Str', 'Marshalltown', 'IA', '50158').then(geo => createSite(geo))
