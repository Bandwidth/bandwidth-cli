module.exports = {
  'msgCallbackUrl': {
    'type': 'input',
    'name': 'msgCallbackUrl',
    'message': 'Please enter a message callbackUrl. Information about sent messages will be sent here. (example: http://example.com)'
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
  'siteDescription': {
    'type': 'input',
    'name': 'siteDescription',
    'message': '(Optional) Enter a description for your site, or skip by leaving this blank.'
  },
  'siteCustomerProvidedID': {
    'type': 'input',
    'name': 'siteCustomerProvidedID',
    'message': '(Optional) Provide an identifier for your site, or skip by leaving this blank.'
  },
  'siteCustomerName': {
    'type': 'input',
    'name': 'siteCustomerName',
    'message': '(Optional) Provide a name to be associated with your site.'
  },
}
