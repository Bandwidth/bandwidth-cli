const utils = require('../api-utils');
const numbers = require("@bandwidth/numbers");
const printer = require('../printer')

module.exports.createAppAction = async (name, cmdObj) => {
  const options = cmdObj.opts();
  switch (options.type) {
    case 'v':
    case 'voice':
      {
        const voiceAppPrompts = [ //possible add "advanced" creating for other fields?
          {
            type: 'input',
            name: 'callInitiatedCallbackUrl',
            message: "Please enter a callInitiatedCallbackUrl" //this is the only mandatory field so far.
          }
        ]
        const answers = await printer.prompt(voiceAppPrompts)
        const createdApp = await numbers.Application.createVoiceApplicationAsync({
          appName: name,
          callInitiatedCallbackUrl: answers.callInitiatedCallbackUrl
        });
        printer.success('Voice application created. See details of your created application below.')
        printer.removeClient(createdApp);
      }
      break;
    case 'm':
    case 'messaging':
      {
        const messageAppPrompts = [
          {
            type: 'input',
            name: 'msgCallbackUrl',
            message: "Please enter a message callbackUrl"
          }
        ]
        const answers = await await printer.prompt(messageAppPrompts)
        const createdApp = await numbers.Application.createMessagingApplicationAsync({
          appName: name,
          msgCallbackUrl: answers.msgCallbackUrl
        })
        printer.success('Messaging application created. See details of your created application below.')
        printer.removeClient(createdApp);
      }
      break;
    default:
      printer.reject('type must be either voice(v) or messaging(m)') //FIXME make this an error and catch it.
  }
}

module.exports.createSiteAction = async (name, cmdObj) => {
  const options = cmdObj.opts();
  let addressType;
  if (options.addressType === 's') {addressType = 'service'}
  if (options.addressType === 'b') {addressType = 'billing'}
  if (addressType !== 'service' && addressType !== 'billing') {
    throw Error('addressType must be either service(s) or billing(b)')
  }
  const sitePrompts = [
    {
      type: 'input',
      name: 'addressLine1',
      message: "Sites require an address. Please enter address line 1"
    },
    {
      type: 'input',
      name: 'addressLine2',
      message: "Please enter the city, state, and ZIP, each seperated by a comma and a space"
    }
  ]
  const answers = await printer.prompt(sitePrompts);
  const address = await utils.geocode(answers.addressLine1, ...answers.addressLine2.split(', '))
  const createdSite = await numbers.Site.createAsync({
    name: name,
    address: {
      ...address,
      addressType: addressType,
    }
  }).catch(printer.httpError)
  printer.success('Site created. See details of your created Site below.')
  printer.removeClient(createdSite);
}

module.exports.createSipPeerAction = async (name, cmdObj) => {
  const options = cmdObj.opts();
  const siteId = options.siteId;
  const createdPeer = await numbers.SipPeer.createAsync({
    peerName: name,
    isDefaultPeer: options.default,
    siteId: siteId,
  }).catch(printer.httpError)
  printer.success('Sip Peer created. See details of your created Peer below.')
  printer.removeClient(createdPeer);
}
