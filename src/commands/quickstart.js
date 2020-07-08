const numbers = require("@bandwidth/numbers");
const printer = require('../printer');
const { ApiError, BadInputError } = require('../errors')
const utils = require('../utils')


module.exports.quickstartAction = async () => {
  printer.print('An address is required for this quickstart.');
  const prompts = [
    {
      type: 'input',
      name: 'addressLine1',
      message: "Please enter address line 1. (example: 900 Main Campus Dr)"
    },
    {
      type: 'input',
      name: 'addressLine2',
      message: "Please enter the city, state, and ZIP, each seperated by a comma and a space. (example: Raleigh, NC, 27606)"
    },
    {
      type: 'input',
      name: 'messageCallbackUrl',
      message: "Please enter a messaging callback callback url" //TODO possible: if blank, then no messaging. If the voice is blank, no voice?
    }
  ]
  const answers = await printer.prompt(prompts);
  for (const [field, answer] of Object.entries(answers)) {
    if (!answer) {
      throw new BadInputError(`${field} is required for a quickstart.`, field);
    }
  }
  const setupNo = await utils.incrementSetupNo();
  const createdApp = await numbers.Application.createMessagingApplicationAsync({
    appName: `My Messaging Application ${setupNo}`,
    msgCallbackUrl: answers.messageCallbackUrl
  }).catch((err) => {throw new ApiError(err)});
  printer.success(`Messaging application created with id ${createdApp.applicationId}`);
  const line2 = answers.addressLine2.split(', ');
  const address = await numbers.Geocode.requestAsync({
    addressLine1: answers.addressLine1,
    city: line2[0],
    stateCode: line2[1],
    zip: line2[2]
  }).catch((err) => {throw new ApiError(err)});
  printer.print('Address validated.')
  const createdSite = await numbers.Site.createAsync({
    name: `My Site ${setupNo}`,
    address: {
      ...address,
      addressType: 'billing',//doesn't matter, so I just chose one and went with it.
    }
  }).catch((err) => {throw new ApiError(err)});
  printer.success(`Site created with id ${createdSite.id}`)
  const createdPeer = await numbers.SipPeer.createAsync({
    peerName: `My Sip Peer ${setupNo}`,
    isDefaultPeer: true,
    siteId: createdSite.id,
  }).catch((err) => {throw new ApiError(err)});
  printer.success(`Sip Peer created with id ${createdPeer.id}`)
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
  })
  printer.print("enabled SMS.");
  await createdPeer.editApplicationAsync({httpMessagingV2AppId: createdApp.applicationId}).catch((err) => {
    if (err) {
      throw new ApiError(err);
    }
  }).then(()=>{printer.print(`Sip Peer linked to application`)});
  await utils.setDefault('sippeer', createdPeer.id).then(()=> printer.print('Setting default sip peer...'))
  await utils.setDefault('site', createdSite.id).then(()=> printer.print('Setting default site...'))
  await utils.setDefault('sippeer', createdPeer.id).then(()=> printer.print('Setting default sip peer...'))
  printer.print();
  printer.success('setup successful. To order a number using this setup, use "bandwidth order [phone number]"')
}
