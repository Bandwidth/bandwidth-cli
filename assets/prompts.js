module.exports = {
  'msgCallbackUrl': {
    'type': 'input',
    'name': 'msgCallbackUrl',
    'message': 'Please enter a message callbackUrl. Information about sent messages will be sent here. Visit https://dev.bandwidth.com/guides/callbacks/callbacks.html for information on Bandwidth callbacks. (example: http://example.com)'
  },
  'callInitiatedCallbackUrl': {
    'type': 'input',
    'name': 'callInitiatedCallbackUrl',
    'message': 'Please enter a callInitiatedCallbackUrl. Information for outbound calls will be sent here, and Bandwidth will attempt to grab BXML at this endpoint. (example: http://example.com)'
  },
  'addressLine1': {
    'type': 'input',
    'name': 'addressLine1',
    'message': 'Please enter address line 1. (example: 900 Main Campus Dr)'
  },
  'addressLine2': {
    'type': 'input',
    'name': 'addressLine2',
    'message': 'Please enter the city, state, and ZIP, each seperated by a comma and a space. (example: Raleigh, NC, 27606)'
  },
  'username': {
    'type': 'input',
    'name': 'username',
    'message': 'Please enter your Bandwidth dashboard username'
  },
  'password': {
    'type': 'password',
    'name': 'password',
    'message': 'Please enter your Bandwidth dashboard password. This will be securely stored.',
    'mask': '*'
  },
  'accountId': {
    'type': 'input',
    'name': 'accountId',
    'message': 'Please enter your Bandwidth account ID.'
  },
  'orderNumberSelection': (choices) => {
    return {
      'type': 'checkbox',
      'name': 'orderNumberSelection',
      'message': `Found ${choices.length} number${choices.length === 1?'':'s'}. Choose which to order.`,
      'choices': choices
    }
  },
  'confirmNumberOrder': (numbers) => {
    return {
      'type': 'confirm',
      'name': 'confirmNumberOrder',
      'message': `order ${numbers.length} phone number${numbers.length === 1?'':'s'}?`,
      'default': true
    }
  },
  'confirmCategoryOrder': (query) => {
    return {
      'type': 'confirm',
      'name': 'confirmCategoryOrder',
      'message': `order ${query.quantity} numbers?`,
      'default': true
    }
  },
  'initiateOrderNumber': {
    type: 'confirm',
    name: 'initiateOrderNumber',
    message: 'Order phone numbers?',
    default: true
  },
  'optionalInput': (itemName) => {
    return {
      'type': 'input',
      'name': itemName,
      'message': `(Optional) Enter a value for "${itemName}", or leave this blank to skip.`
    }
  },
  hostName: {
    type: 'input',
    name: 'hostName',
    message: 'Please enter a host name. (eg 10.10.10.1)'
  },
  message: {
    type: 'input',
    name: 'message',
    message: "Enter the message you would like to send below:"
  },
  housePrefix: {
    type: 'input',
    name: 'housePrefix',
    message: 'House Prefix'
  },
  houseNumber: {
    type: 'input',
    name: 'houseNumber',
    message: 'House Number'
  },
  houseSuffix: {
    type: 'input',
    name: 'houseSuffix',
    message: 'House Suffix'
  },
  preDirectional: {
    type: 'input',
    name: 'preDirectional',
    message: 'preDirectional'
  },
  streetName: {
    type: 'input',
    name: 'streetName',
    message: 'Street Name'
  },
  streetSuffix: {
    type: 'input',
    name: 'streetSuffix',
    message: 'Street Suffix'
  },
  postDirectional: {
    type: 'input',
    name: 'postDirectional',
    message: 'postdirectional'
  },
  confirmDefault: (defaultName) => {
    return {
      type: 'input',
      name: defaultName,
      message: `Use default ${defaultName}? Press enter to continue, or enter a ${defaultName} instead. To use neither, type "NONE" and hit enter.`
    }
  }
}
