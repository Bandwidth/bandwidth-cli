const utils = require('../api-utils');
const numbers = require("@bandwidth/numbers");
const inquirer = require('inquirer');



module.exports.createAppAction = async (name, cmdObj) => {
  const options = cmdObj.opts();
  switch (options.type) {
    case 'v':
    case 'voice':
      {
        const voiceAppPrompts = [
          {
            type: 'input',
            name: 'callInitiatedCallbackUrl',
            message: "Please enter a callInitiatedCallbackUrl" //this is the only mandatory field so far.
          }
        ]
        const answers = await inquirer.prompt(voiceAppPrompts);
        const createdApp = await numbers.Application.createVoiceApplicationAsync({
          appName: name,
          callInitiatedCallbackUrl: answers.callInitiatedCallbackUrl
        })
        console.log(createdApp)
      }
      break;
    case 'm':
    case 'messaging':
      {
        const messageAppPrompts = [
          {//consider delcaring this elsewhere??? Seems like clutter.
            type: 'input',
            name: 'msgCallbackUrl',
            message: "Please enter a message callbackUrl"
          }
        ]
        const answers = await inquirer.prompt(messageAppPrompts);
        const createdApp = await numbers.Application.createMessagingApplicationAsync({
          appName: name,
          msgCallbackUrl: answers.msgCallbackUrl
        })
        console.log(createdApp)
      }
      break;
    default:
      console.log('type must be either voice(v) or messaging(m)') //FIXME make this an error and catch it.
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
      message: "Sites require an address. Please enter address line 1. (example: 900 Main Campus Dr)"
    },
    {
      type: 'input',
      name: 'addressLine2',
      message: "Please enter the city, state, and ZIP, each seperated by a comma and a space. (example: Raleigh, NC, 27606)"
    }
  ]
  const answers = await inquirer.prompt(sitePrompts);
  const address = await utils.geocode(answers.addressLine1, ...answers.addressLine2.split(', '))
  const createdSite = await numbers.Site.createAsync({
    name: name,
    address: {
      ...address,
      addressType: addressType,
    }
  }).catch(console.log)
  console.log(createdSite)
}

module.exports.createSipPeerAction = async (name, cmdObj) => {
  const options = cmdObj.opts();
  const siteId = options.siteId;
  const createdPeer = await numbers.SipPeer.createAsync({
    peerName: name,
    isDefaultPeer: options.default,
    siteId: siteId,
  }).catch(console.log)
  console.log(createdPeer)
}
