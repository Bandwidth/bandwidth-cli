const numbers = require("@bandwidth/numbers");
const printer = require('../printer');
const { ApiError, BadInputError } = require('../errors')
const utils = require('../utils')
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
        }).catch((err) => {throw new ApiError(err)});
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
            message: "Please enter a message callbackUrl. Information about sent messages will be sent here."
          }
        ]
        const answers = await printer.prompt(messageAppPrompts)
        const createdApp = await numbers.Application.createMessagingApplicationAsync({
          appName: name,
          msgCallbackUrl: answers.msgCallbackUrl
        }).catch((err) => {throw new ApiError(err)});
        printer.success('Messaging application created. See details of your created application below.')
        printer.removeClient(createdApp);
      }
      break;
    default:
      throw new BadInputError('type must be either voice(v) or messaging(m)')
  }
}

module.exports.createSiteAction = async (name, cmdObj) => {
  const options = cmdObj.opts();
  let addressType;
  if (options.addressType === 's') {addressType = 'service'}
  if (options.addressType === 'b') {addressType = 'billing'}
  if (addressType !== 'service' && addressType !== 'billing') {
    throw new BadInputError('addressType must be either service(s) or billing(b)');
  }
  const sitePrompts = [
    {
      type: 'input',
      name: 'addressLine1',
      message: "Sites require an address. Please enter address line 1. (example: 900 Main Campus Dr)"
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
  const createdSite = await numbers.Site.createAsync({
    name: name,
    address: {
      ...address,
      addressType: addressType,
    }
  }).catch((err) => {throw new ApiError(err)});
  printer.success('Site created. See details of your created Site below.')
  printer.removeClient(createdSite);
}

module.exports.createSipPeerAction = async (name, cmdObj) => {
  const options = cmdObj.opts();
  const siteId = await utils.processDefault('site', options.siteId);
  if (!siteId) {
    throw new BadInputError('Missing a Site ID', "siteId", "Specify a siteId using the --siteId switch, or set a default site using \"bandwidth default site <siteId>\"");
  }
  const createdPeer = await numbers.SipPeer.createAsync({
    peerName: name,
    isDefaultPeer: options.default,
    siteId: siteId,
  }).catch((err) => {throw new ApiError(err)});
  printer.print('Peer created successfully...')
  const defaultApp = await utils.readDefault('application');
  //Enable HTTP SMS (required to link app) and link default app (assuming it's a messaging app) if a default app is set.
  if (defaultApp){
    const smsSettings = {
      tollFree: true,
      zone1: true,
      zone2: true,
      zone3: true,
      zone4: true,
      zone5: true,
      protocol: "HTTP",
    }
    const httpSettings = {
      v2Messaging: true
    }
    await createdPeer.createSmsSettingsAsync({sipPeerSmsFeatureSettings: smsSettings, httpSettings: httpSettings}).catch((err) => {
      if (err) {
        throw new ApiError(err);
      }
    }).then(()=>{printer.print("enabled SMS by default.")}); //TODO: option to disable SMS or customize peer creation
    await createdPeer.editApplicationAsync({httpMessagingV2AppId: defaultApp}).catch((err) => {
      if (err) {
        throw new ApiError(err);
      }
    }).then(()=>{printer.print(`Linked created Sip Peer to default application ${defaultApp}`)});
  }
  printer.success('Sip Peer created. See details of your created Peer below.');
  printer.removeClient(createdPeer);
}
