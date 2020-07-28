const numbers = require('@bandwidth/numbers');
const BandwidthMessaging = require('@bandwidth/messaging');
//====================INPUTS==========================
const siteID = 'INSERT YOUR SITE ID HERE.';
const sipPeerId = 'INSERT YOUR SIP PEER ID HERE.';
const messagingApplicationId = 'INSERT YOUR MESSAGING APPLICATION ID HERE.';
numbers.Client.globalOptions.accountId = process.env.BANDWIDTH_ACCOUNT_ID;
numbers.Client.globalOptions.userName = process.env.BANDWIDTH_API_USER;
numbers.Client.globalOptions.password = process.env.BANDWIDTH_API_PASSWORD;
BandwidthMessaging.Configuration.basicAuthUserName = process.env.BANDWIDTH_API_USER;
BandwidthMessaging.Configuration.basicAuthPassword = process.env.BANDWIDTH_API_PASSWORD;
const MessagingAccountId = process.env.BANDWIDTH_ACCOUNT_ID;

const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Order a new phone number and send a message to the customer using the phone
 * number, then associate the phone number with the customer
 * @param {Object} customer information about the customer
 * @param {string} customer.name the full name of the customer
 * @param {string|number} customer.phoneNumber the phone number of the customer
 * @param {string} customer.state the 2 letter code for the geographic state that the customer is in
 * 
 */
const addCustomer = async (customer) => {
  //order number
  const order = {
    name: `${customer.name}'s phone number`,
    siteId: siteID,
    peerId: sipPeerId, //optional
    stateSearchAndOrderType: {
      quantity: 1,
      state: customer.state
    }
  };
  const createdOrder = await numbers.Order.createAsync(order).then(orderResponse => orderResponse.order).catch(err => {console.error(err)});
  await sleep(5000); //Wait for order to complete. 
  const tnResponse = await createdOrder.getTnsAsync();
  const tn = tnResponse.telephoneNumber;
  
  //send message
  const body = new BandwidthMessaging.MessageRequest({
    applicationId: messagingApplicationId,
    to : customer.phoneNumber,
    from : tn,
    text : `Welcome to our company, ${customer.name}!`
  });
  const response = await BandwidthMessaging.APIController.createMessage(MessagingAccountId, body)
    .catch(err => {
      console.error(err.errorMessage);
      process.exit(1);
    });

  return {
    ...customer,
    marketingNumber: tn
  }
}

module.exports.addCustomer = addCustomer;
