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
  'loginPrompts': [
    {
      'type': 'input',
      'name': 'username',
      'message': 'Please enter your Bandwidth dashboard username'
    },
    {
      'type': 'password',
      'name': 'password',
      'message': 'Please enter your Bandwidth dashboard password. This will be securely stored.',
      'mask': '*'
    },
    {
      'type': 'input',
      'name': 'accountId',
      'message': 'Please enter your Bandwidth account ID.'
    }
  ],
  'orderNumberSelection': (choices) => {
    return {
      'type': 'checkbox',
      'name': 'orderNumberSelection',
      'message': 'Your query has return these numbers. Select any and all of them that you would like to order.',
      'choices': choices
    }
  }
}
