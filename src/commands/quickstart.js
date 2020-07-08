const numbers = require("@bandwidth/numbers");
const printer = require('../printer');
const { ApiError, BadInputError } = require('../errors')
const utils = require('../utils')


module.exports.quickstartAction = async (cmdObj) => {
  const opts = cmdObj.opts();
  const verbose = opts.verbose;
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
      message: "Please enter a message callbackUrl. Information about sent messages will be sent here." //TODO possible: if blank, then no messaging. If the voice is blank, no voice?
    }
  ]
  const answers = await printer.prompt(prompts);
  for (const [field, answer] of Object.entries(answers)) {
    if (!answer) {
      throw new BadInputError(`${field} is required for a quickstart.`, field);
    }
  }
  const setupNo = await utils.incrementSetupNo(); //used to avoid name clash errors, if for some reason they run it multiple times.
  const line2 = answers.addressLine2.split(', ');
  if (line2.length !== 3) {
    throw new BadInputError('Address line 2 was not parsed correctly', 'addressLine2', 'Ensure that you have seperated the City, statecode, and zip with a space and a comma. ", "')
  }
  const address = await numbers.Geocode.requestAsync({
    addressLine1: answers.addressLine1,
    city: line2[0],
    stateCode: line2[1],
    zip: line2[2]
  }).catch((err) => {throw new ApiError(err)});
  printer.printIf(verbose, 'Address validated.');
  const createdApp = await numbers.Application.createMessagingApplicationAsync({
    appName: `My Messaging Application ${setupNo}`,
    msgCallbackUrl: answers.messageCallbackUrl
  }).catch((err) => {throw new ApiError(err)});
  printer.success(`Messaging application created with id ${createdApp.applicationId}`);
  const createdSite = await numbers.Site.createAsync({
    name: `My Site ${setupNo}`,
    address: {
      ...address,
      addressType: 'billing',//billing/service have no functional differences but is required.
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
  printer.printIf(verbose, "enabled SMS in sip peer.");
  await createdPeer.editApplicationAsync({httpMessagingV2AppId: createdApp.applicationId}).catch((err) => {
    if (err) {
      throw new ApiError(err);
    }
  }).then(()=>{printer.printIf(verbose, `Sip Peer linked to application`)});
  await utils.setDefault('sippeer', createdPeer.id, !verbose).then(()=> printer.printIf(verbose, 'Default Sip Peer set'))
  await utils.setDefault('site', createdSite.id, !verbose).then(()=> printer.printIf(verbose, 'Default site set'))
  await utils.setDefault('application', createdPeer.id, !verbose).then(()=> printer.printIf(verbose, 'Default application set'))

  let orderResponse = await printer.prompt({
    type: 'confirm',
    name: 'orderNumber',
    message: 'order a phone number?',
    default: true
  })

  const orderNumber = orderResponse.orderNumber
  if (orderNumber) {
    var order = {
      name:"Bandwidth Quickstart Order",
      siteId: createdSite.id,
      peerId: createdPeer.id,
      ZIPSearchAndOrderType: {
        quantity: 1,
        zip: address.zip
      }
    };
    const createdOrder = (await numbers.Order.createAsync(order)).order;
    const orderedTn = (await createdOrder.getTnsAsync()).telephoneNumber;
    if (orderedTn) {
      printer.success(`Phone number order for ${orderedTn} placed based on area code`)
    } else {
      printer.warn('Order placed but was unable to retrieve your phone number. Check your Bandwidth Dashboard.')
    }
  }
  printer.print();
  printer.print(`setup successful. To order ${orderNumber?'more numbers':'a number'} using this setup, use "bandwidth order [phone number]"`)
}
