//A Free-for-all playground to run code without changing things, hopefully.
//const utils = require('../api-utils');
const numbers = require("@bandwidth/numbers");
numbers.Client.globalOptions.accountId = process.env.BANDWIDTH_ACCOUNT_ID;
numbers.Client.globalOptions.userName = process.env.BANDWIDTH_API_USER;
numbers.Client.globalOptions.password = process.env.BANDWIDTH_API_PASSWORD;



const main = async () => {
  let peer = new numbers.SipPeer();
  peer.id = 583183;
  peer.siteId = 8416;
  peer.client = new numbers.Client();
  console.log(await peer.removeApplicationsAsync().catch(console.log))

}
main()
//const { deleteApplication, createSippeer, listSippeers, geocode, createSite, deleteSite, deleteSippeer, createVoiceApplication, createMessageApplication } = require('../api-utils');
/*
geocode('900 Main Campus dr', 'Raleigh', 'NC', '27606').then(address => createSite({
  name: "Site name",
  address: address,
  addressType: 'billing'
})).then(console.log).catch(err => {console.log(err)})
*/
/*
createVoiceApplication({
  serviceType: 'Voice-V2',
  appName: 'Voice Application Name',
  callInitiatedCallbackUrl: 'https://example.com',
  callInitiatedMethod: 'GET',
}).then(console.log).catch(console.log)
*//*
{
  Application: {
    ServiceType: 'Voice-V2',
    AppName: 'Voice Application Name',
    CallInitiatedCallbackUrl: 'https://example.com',
    CallInitiatedMethod: 'GET',
    CallStatusCallbackUrl: 'https://example.com',
    CallStatusMethod: 'GET',
    CallbackCreds: {
      UserId: 'testId',
      Password: 'testPass'
    }
  },
}
*/
