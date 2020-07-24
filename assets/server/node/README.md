# my-bandwidth-messaging-server
A public facing server which processes callbacks from Bandwidth. 
## Instructions
Set the following environment variables:
```
set BANDWIDTH_ACCOUNT_ID myAccId
set BANDWIDTH_API_USER myDashboardUser
set BANDWIDTH_API_PASSWORD myDashboardPassword
```
Note that these are the same credentials you used to log into the CLI.

After this, `npm start` will create the server and update the callback url of the listed application to this server

## what it does
When run, this server will: 
* Create a server and expose it publicly via an ngrok url
* Update an application's callback to the generated url
* Print any message callbacks to console.


## examples
```
Server started. The following url has been set as your application URL: https://ff628adc85aa.ngrok.io
Express server listening on localhost port 80. Access it non-locally by making requests to https://ff628adc85aa.ngrok.io
Callback received:
//sent
[
  {
    time: '2020-07-24T22:38:03.905Z',
    type: 'message-delivered',
    to: '+13152345349',
    description: 'ok',
    message: {
      id: '1595630283263mjkhfistu34f6x3f',
      owner: '+17755530705',
      applicationId: 'd381cdb4-4ce6-429b-b46b-60243fa4552a',
      time: '2020-07-24T22:38:03.263Z',
      segmentCount: 1,
      direction: 'out',
      to: [Array],
      from: '+17755530705',
      text: '',
      tag: ''
    }
  }
]

//Response
Callback received:
[
  {
    time: '2020-07-24T22:40:38.435Z',
    type: 'message-received',
    to: '+17755530705',
    description: 'Incoming message received',
    message: {
      id: 'ed71f1d2-c691-4a79-aef5-208fef20a032',
      owner: '+17755530705',
      applicationId: 'd381cdb4-4ce6-429b-b46b-60243fa4552a',
      time: '2020-07-24T22:40:38.338Z',
      segmentCount: 1,
      direction: 'in',
      to: [Array],
      from: '+13152345349',
      text: 'This is my response'
    }
  }
]

```
