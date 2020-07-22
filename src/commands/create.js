const numbers = require("@bandwidth/numbers");
const printer = require('../printer');
const { BadInputError, throwApiErr } = require('../errors');
const utils = require('../utils');
const { description } = require("commander");

module.exports.createAppAction = async (name, cmdObj) => {
  const options = cmdObj.opts();
  switch (options.type) {
    case 'v':
    case 'voice':
      {
        const answers = await printer.prompt('callInitiatedCallbackUrl')
        const createdApp = await numbers.Application.createVoiceApplicationAsync({
          appName: name,
          callInitiatedCallbackUrl: answers.callInitiatedCallbackUrl
        }).catch(throwApiErr);
        printer.success('Voice application created. See details of your created application below.')
        printer.removeClient(createdApp);
      }
      break;
    case 'm':
    case 'messaging':
      {
        const answers = await printer.prompt('msgCallbackUrl')
        const createdApp = await numbers.Application.createMessagingApplicationAsync({
          appName: name,
          msgCallbackUrl: answers.msgCallbackUrl
        }).catch(throwApiErr);
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
  addressType = options.addressType;
  if (addressType === 's') {addressType = 'service'}
  if (addressType === 'b') {addressType = 'billing'}
  if (addressType !== 'service' && addressType !== 'billing') {
    throw new BadInputError('addressType must be either service(s) or billing(b)');
  }
  const answers = await printer.prompt(['addressLine1', 'addressLine2']);
  const line2 = answers.addressLine2.split(', ');
  if (line2.length !== 3) {
    throw new BadInputError('Address line 2 was not parsed correctly', 'addressLine2', 'Ensure that you have seperated the City, statecode, and zip with a space and a comma. ", "')
  }
  const address = await numbers.Geocode.requestAsync({
    addressLine1: answers.addressLine1,
    city: line2[0],
    stateCode: line2[1],
    zip: line2[2]
  }).catch(throwApiErr);
  let optionalAnswers = {};
  if (options.custom) {
    optionalAnswers = await printer.prompt(Array(3).fill('optionalInput'), 'description', 'customerProvidedID', 'customerName');
  } 
  //Note: it seems that customerprovidedId is being ignored by the API.
  const siteRequest = {
    name: name,
    address: {
      ...address,
      addressType: addressType,
    },
    ...optionalAnswers
  };
  Object.keys(siteRequest).forEach(key => !siteRequest[key] && delete siteRequest[key]);
  const createdSite = await numbers.Site.createAsync(siteRequest).catch(throwApiErr);
  printer.success('Site created. See details of your created Site below.');
  printer.removeClient(createdSite);
}

module.exports.createSipPeerAction = async (name, cmdObj) => {
  const options = cmdObj.opts();
  const siteId = await utils.processDefault('site', options.siteId);
  if (!siteId) {
    throw new BadInputError('Missing a Site ID', "siteId", "Specify a siteId using the --site-id switch, or set a default site using \"bandwidth default site <siteId>\"");
  }
  const peerRequest = {
    peerName: name,
    isDefaultPeer: options.default,
    siteId: siteId,
  }
  if (options.custom) {
    optionalAnswers = await printer.prompt(Array(5).fill('optionalInput'), ['a','b','c','d','e']);
  }
  const createdPeer = await numbers.SipPeer.createAsync(peerRequest).catch(throwApiErr);
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
    await createdPeer.createSmsSettingsAsync({sipPeerSmsFeatureSettings: smsSettings, httpSettings: httpSettings})
      .catch(throwApiErr)
      .then(()=>{printer.print("enabled SMS by default.")}); //TODO: option to disable SMS or customize peer creation
    await createdPeer.editApplicationAsync({httpMessagingV2AppId: defaultApp})
      .catch(throwApiErr)
      .then(()=>{printer.print(`Linked created Sip Peer to default application ${defaultApp}`)});
  }
  printer.success('Sip Peer created. See details of your created Peer below.');
  printer.removeClient(createdPeer);
}
