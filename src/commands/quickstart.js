const numbers = require("@bandwidth/numbers");
const printer = require('../printer');
const { BadInputError, throwApiErr } = require('../errors');
const utils = require('../utils');
const apiutils = require("../apiutils");


module.exports.quickstartAction = async (cmdObj) => {
  const opts = cmdObj.opts();
  const verbose = opts.verbose;
  const custom = opts.custom;
  const quickstartPrompts = [
    'msgCallbackUrl'
  ]
  const answers = await printer.prompt(quickstartPrompts);
  for (const [field, answer] of Object.entries(answers)) {
    if (!answer) {
      throw new BadInputError(`${field} is required for a quickstart.`, field);
    }
  }
  const setupNo = await utils.incrementSetupNo(); //used to avoid name clash errors, if for some reason they run it multiple times.
  let address;
  if (custom) {
    const addressInput = await printer.prompt(['addressLine1', 'addressLine2']);
    const line2 = addressInput.addressLine2.split(', ');
    if (line2.length !== 3) {
      throw new BadInputError('Address line 2 was not parsed correctly', 'addressLine2', 'Ensure that you have seperated the City, statecode, and zip with a space and a comma. ", "')
    }
    const rawAddress = {
      addressLine1: addressInput.addressLine1,
      city: line2[0],
      stateCode: line2[1],
      zip: line2[2]
    }
    address = await numbers.Geocode.requestAsync(rawAddress).catch(throwApiErr); //TODO when caught, check for 403
    printer.printIf(verbose, 'Address validated.');
  } else {
    address = {
      addressLine1: '900 MAIN CAMPUS DR',
      houseNumber: 900,
      streetName: 'MAIN CAMPUS',
      streetSuffix: 'DR',
      city: 'RALEIGH',
      stateCode: 'NC',
      zip: 27606,
      plusFour: 5177,
      country: 'US'
    }
  }
  const createdApp = await numbers.Application.createMessagingApplicationAsync({
    appName: (custom&&(await printer.prompt('optionalInput', 'appName')).appName) ||`My Messaging Application ${setupNo}`,
    msgCallbackUrl: answers.msgCallbackUrl
  }).catch(throwApiErr);
  printer.success(`Messaging application created with id ${createdApp.applicationId}`);
  const createdSite = await numbers.Site.createAsync({
    name: (custom&&(await printer.prompt('optionalInput', 'siteName')).siteName) ||`My Site ${setupNo}`,
    address: {
      ...address,
      addressType: 'billing',//billing/service have no functional differences but is required.
    }
  }).catch(throwApiErr);
  printer.success(`Site created with id ${createdSite.id}`)
  const createdPeer = await numbers.SipPeer.createAsync({
    peerName: (custom&&(await printer.prompt('optionalInput', 'sippeerName')).sippeerName) ||`My Sip Peer ${setupNo}`,
    isDefaultPeer: true,
    siteId: createdSite.id,
  }).catch(throwApiErr);
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
  await createdPeer.createSmsSettingsAsync({sipPeerSmsFeatureSettings: smsSettings, httpSettings: httpSettings})
    .catch(throwApiErr)
  printer.printIf(verbose, "enabled SMS in sip peer.");
  await createdPeer.editApplicationAsync({httpMessagingV2AppId: createdApp.applicationId})
    .catch(throwApiErr)
    .then(()=>{printer.printIf(verbose, `Sip Peer linked to application`)});
  await utils.setDefault('sippeer', createdPeer.id, !verbose).then(()=> printer.printIf(verbose, 'Default Sip Peer set'))
  await utils.setDefault('site', createdSite.id, !verbose).then(()=> printer.printIf(verbose, 'Default site set'))
  await utils.setDefault('messageApp', createdApp.applicationId, !verbose).then(()=> printer.printIf(verbose, 'Default messageApp set'))

  let orderResponse = (await printer.prompt('initiateOrderNumber')).initiateOrderNumber
  if (orderResponse) {
    //hand-tested list of states for which bandwidth has numbers
    const states = [ 'AL', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'DC', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'PR', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY' ];
    let results = null;
    let retries = 10;
    while (!(results && results.resultCount && retries--)) {
      const randomState = states[Math.floor(Math.random() * states.length)]; //number from a random state.
      var query = {
        siteId: createdSite.id,
        peerId: createdPeer.id,
        state: randomState||'NC',
        quantity: (custom && (await printer.prompt('optionalInput', 'phone number search quantity'))['phone number search quantity']) || 10
      };
      results = await numbers.AvailableNumbers.listAsync(query).catch(throwApiErr);
    }
    if (!(results && results.resultCount)) {
      printer.warn('Unable to find a number at this time.');
    } else if (results.resultCount === 1) {
      selected = results.telephoneNumberList.telephoneNumber
    } else {
      selected = (await printer.prompt('orderNumberSelection', results.telephoneNumberList.telephoneNumber)).orderNumberSelection
    }
    await utils.setDefault('number', selected[0], !verbose)
    if (selected){
      await apiutils.placeNumberOrder(selected, createdSite.id, createdPeer.id).catch();
    }
  }
  printer.print();
  printer.print(`setup successful. To order ${orderResponse?'more numbers':'a number'} using this setup, use "bandwidth order category <quantity>" or "bandwidth order search <quantity>"`);
  printer.custom('brightCyan')(`The site id ${createdSite.id} has been saved in the CLI config and will be used by the CLI to order numbers. When ordering numbers outside of the CLI, you may place the order under the site id ${createdSite.id}.`);
}
