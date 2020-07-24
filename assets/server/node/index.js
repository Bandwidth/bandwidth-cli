const express = require('express');
const ngrok = require('ngrok');
const numbers = require('@bandwidth/numbers');

const main = async (args) => {
  const port = 80;
  const messagingApplicationId = 'INSERT YOUR MESSAGING APPLICATION ID HERE.';


  //===================use ngrok to port into localhost=================
  const onStatusChange = (status) => {
    status === 'closed'?console.log('ngrok connection is lost'):console.log('ngrok reconnected');
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
  server.listen(port)

  //===================Set message callback url to ngrok url=================
  const messagingApplication = await numbers.Application.getAsync(messagingApplicationId);
  messagingApplication.msgCallbackUrl = url;
  await messagingApplication.updateAsync(messagingApplication);
  console.log("Server started. The following url has been set as your application URL:", url);
  //See https://dev.bandwidth.com/messaging/callbacks/messageEvents.html for information about messaging callbacks
  //server.get()

  //==================Handle Bandwidth webhook/callback==============
  server.get('*', (req, res) => {
    console.log(req);
    res.status(200)
  })
  console.log(`Express server listening on localhost port ${port}. Access it non-locally by making requests to ${url}`);
}
main(process.argv.slice(2))
