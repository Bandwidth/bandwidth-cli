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
    'messagingCallbackUrl',
    'callInitiatedCallbackUrl',
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
    address = await numbers.Geocode.requestAsync(rawAddress)
      .then((result) => {
        printer.printIf(verbose, 'Address validated.');
        return result;
      })
      .catch(async (err) => {
        if (err.status === 403) {
          printer.warn('Geocoding not found in account. Please split your address Line 1 into its respective components.')
          printer.warn('For example, 123 Main St would have houseNumber: 123, street name: Main, and street suffix: St.');
          printer.print('Components include:');
          printer.printObj(['House Prefix', 'House Number', 'House Suffix', 'pre Directional', 'Street Name', 'Street Suffix', 'post Directional'])
          const manualLine1 = await printer.prompt(['housePrefix','houseNumber', 'houseSuffix', 'preDirectional', 'streetName', 'streetSuffix', 'postDirectional'])
          return {...rawAddress, ...manualLine1}
        } else (throwApiErr(err));
      });
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

  const createdMessagingApp = await numbers.Application.createMessagingApplicationAsync({
    appName: (custom&&(await printer.prompt('optionalInput', 'appName')).appName) ||`My Messaging Application ${setupNo}`,
    msgCallbackUrl: answers.messagingCallbackUrl
  }).catch(throwApiErr);
  printer.success(`Messaging application created with id ${createdMessagingApp.applicationId}. You will need this as your "applicationId" value to send a text message`);

  const createdVoiceApp = await numbers.Application.createVoiceApplicationAsync({
    appName: (custom&&(await printer.prompt('optionalInput', 'appName')).appName) ||`My Voice Application ${setupNo}`,
    callInitiatedCallbackUrl: answers.callInitiatedCallbackUrl,
    serviceType: 'Voice-V2'
  }).catch(throwApiErr);
  printer.success(`Voice application created with id ${createdVoiceApp.applicationId}. You will need this as your "applicationId" value to create phone calls`);

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

  await createdPeer.editApplicationAsync({httpMessagingV2AppId: createdMessagingApp.applicationId})
    .catch(throwApiErr)
    .then(()=>{printer.printIf(verbose, `Sip Peer linked to messaging application`)});

  var voiceHttpSettings = {
    httpVoiceV2AppId: createdVoiceApp.applicationId
  }
  await createdPeer.createOriginationSettingsAsync({voiceProtocol: "HTTP", httpSettings: voiceHttpSettings})
    .catch(throwApiErr)
    .then(()=>{printer.printIf(verbose, `Sip Peer linked to voice application`)});

  await utils.setDefault('sippeer', createdPeer.id, !verbose).then(()=> printer.printIf(verbose, 'Default Sip Peer set'))
  await utils.setDefault('site', createdSite.id, !verbose).then(()=> printer.printIf(verbose, 'Default site set'))
  await utils.setDefault('messageApp', createdMessagingApp.applicationId, !verbose).then(()=> printer.printIf(verbose, 'Default messageApp set'))

  let orderResponse = (await printer.prompt('initiateOrderNumber')).initiateOrderNumber
  if (orderResponse) {
    //hand-tested list of states for which bandwidth has numbers
    const states = [ 'AL', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'DC', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'PR', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY' ];
    let results = null;
    let retries = 10;
    while (!results && retries > 0) {
      var randomState;
      if (retries == 1) {
          randomState = 'NC'; //failsafe: default to NC on the last try
      } else {
          randomState = states[Math.floor(Math.random() * states.length)]; //number from a random state.
      }
      var query = {
        siteId: createdSite.id,
        peerId: createdPeer.id,
        state: randomState||'NC',
        quantity: (custom && (await printer.prompt('optionalInput', 'phone number search quantity'))['phone number search quantity']) || 10
      };
      results = await numbers.AvailableNumbers.listAsync(query).catch(function(err, res) { return null });
      retries--;
    }

    if (!results) {
      printer.warn('Unable to find a number at this time.');
      process.exit();
    } else if (results.resultCount === 1) {
      selected = results.telephoneNumberList.telephoneNumber
    } else {
      selected = (await printer.prompt('orderNumberSelection', results.telephoneNumberList.telephoneNumber)).orderNumberSelection
    }

    await utils.setDefault('number', selected[0], !verbose)

    if (selected){
      await apiutils.placeNumberOrder(selected, createdSite.id, createdPeer.id).catch();

      let viewFinalOutput = (await printer.prompt('viewQuickstartFinalOutput')).viewQuickstartFinalOutput
      if (viewFinalOutput) {
        printer.print(`Messaging Information`);
        printer.print(``);
        printer.print(`You can use any of your ordered numbers as the "from" value to send a text message. Numbers must be converted to E164 format`);
        printer.print(``);
        printer.print(`Ready to send a text message? You can use the JSON body below as your request body on the Bandwidth Messaging API. Just fill in the appropriate values for "to" and "text"`);
        printer.print(``);
        printer.print(JSON.stringify({
          "applicationId": createdMessagingApp.applicationId,
          "from": "+1" + selected[0],
          "to": ['<recipient phone number in E164 format ex: +15554443333>'],
          "text": '<text message contents ex: Hello from Bandwidth!>'
        }, null, 4));
        printer.print(``);
        printer.print(`You can also send a text message to your ordered numbers. When a message is sent to these numbers, Bandwidth will send a callback to your messaging callback url`);

        printer.print(``);
        printer.print(`Voice Information`);
        printer.print(``);
        printer.print(`You can use any of your ordered numbers as the "from" value to create a phone call. Numbers must be converted to E164 format`);
        printer.print(``);
        printer.print(`Ready to make a phone call? You can use the JSON body below as your request body on the Bandwidth Call API. Just fill in the appropriate values for "to" and "answerUrl"`);
        printer.print(``);
        printer.print(JSON.stringify({
          "applicationId": createdVoiceApp.applicationId,
          "from": "+1" + selected[0],
          "to": "<recipient phone number in E164 format ex: +15554443333>",
          "answerUrl": "<URL that Bandwidth will request BXML from when the call is answered ex: https://callback.com/answerBxml"
        }, null, 4));
        printer.print(``);
        printer.print(`You can also call your ordered numbers. When a call is made to these numbers, Bandwidth will send a callback to your voice callback url`);
      }
    }
  }

  printer.print();
  printer.print(`setup successful. To order ${orderResponse?'more numbers':'a number'} using this setup, use "bandwidth order category <quantity>" or "bandwidth order search <quantity>"`);
  printer.custom('brightCyan')(`The site id ${createdSite.id} has been saved in the CLI config and will be used by the CLI to order numbers. When ordering numbers outside of the CLI, you may place the order under the site id ${createdSite.id}.`);
}
