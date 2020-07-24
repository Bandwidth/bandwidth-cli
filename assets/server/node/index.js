const express = require('express');
const ngrok = require('ngrok');
const numbers = require('@bandwidth/numbers');
const readline = require('readline');
//====================INPUTS==========================
const port = 80;
const messagingApplicationId = 'INSERT YOUR MESSAGING APPLICATION ID HERE.';
numbers.Client.globalOptions.accountId = process.env.BANDWIDTH_ACCOUNT_ID;
numbers.Client.globalOptions.userName = process.env.BANDWIDTH_API_USER;
numbers.Client.globalOptions.password = process.env.BANDWIDTH_API_PASSWORD;




const main = async (args) => {
  //===================use ngrok to port into localhost=================
  const onStatusChange = (status) => {
    status === 'closed'?console.log('ngrok connection is lost'):console.log('ngrok connected');
  }
  const onLogEvent = data => {
    //console.log(data);
    //uncomment to see server status updates
  };
  const url = await ngrok.connect({
    addr: port, // port or network address, defaults to 80
    onStatusChange: onStatusChange,
    onLogEvent: onLogEvent
  });
  const server = express();
  server.use(express.json());
  server.listen(port);

  //===================Set message callback url to ngrok url=================
  const messagingApplication = await numbers.Application.getAsync(messagingApplicationId).catch((err) => {
    if (err.status === 404) {
      console.error(`Server returned 404. Please double check the value of your application ID, which is currently ${messagingApplicationId}, or your account id, ${numbers.Client.globalOptions.accountId}.`);
    } else {
      console.error(err.message);
    }
    process.exit(1);
  });
  console.warn(`This operation will overwrite the callback url of your application ${messagingApplicationId}("${messagingApplication.appName}"). Press enter to continue, or Ctrl+C to quit.` );
  await new Promise(resolve => {
    process.stdin.once('data', function () {resolve()});
  })
  messagingApplication.callbackUrl = messagingApplication.msgCallbackUrl = url;
  await messagingApplication.updateAsync(messagingApplication).catch(err => {
    console.error(err)
  });
  console.log("Server started. The following url has been set as your application URL:", url);
  //See https://dev.bandwidth.com/messaging/callbacks/messageEvents.html for information about messaging callbacks

  //==================Handle Bandwidth webhook/callback==============
  server.post('*', (req, res) => {
    console.log('Callback received:');
    console.log(req.body);
    res.status(200)
  })
  console.log(`Express server listening on localhost port ${port}. Access it non-locally by making requests to ${url}`);
}
main(process.argv.slice(2))
