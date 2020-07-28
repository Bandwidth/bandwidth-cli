# my-bandwidth-messaging-app
An app which, when a new user is reported, creates a phone number for them and automatically sends them a welcome text message.
## Instructions
Set the following environment variables:
```
set BANDWIDTH_ACCOUNT_ID myAccId
set BANDWIDTH_API_USER myDashboardUser
set BANDWIDTH_API_PASSWORD myDashboardPassword
```
Note that these are the same credentials you used to log into the CLI.

After this, `npm start` in this directory will create the server and update the callback url of the specified application to this server. This application is initially set to the `default application` of your bandwidth CLI, but can be changed in line 7 of `index.js`. 

## what it does
When run, this server will: 
* Create a server and expose it publicly via an ngrok url
* Update an application's callback to the generated url
* Print any message callbacks to console.


## examples
