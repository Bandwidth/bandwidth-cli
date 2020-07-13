# Bandwidth CLI
## Table of Contents
[table of contexts](#table-of-contents)
[setup](#installationsetup)

## Installation/Setup
This Bandwidth CLI uses nodeJs version X.X.X. If node is not installed on your computer, visit https://nodejs.org/en/download/ for installation instructions for node.

With node on your machine, install the package globally through npm (or yarn)
```
npm install -g @bandwidth/cli

or

yarn global add @bandwidth/cli
```

log into your bandwidth account by specifying your account id, and your dashboard username and password.


```
>bandwidth login
Leaving a field blank will keep it at its previous value.
? Please enter your Bandwidth dashboard username myUsername
? Please enter your Bandwidth dashboard password. This will be securely stored. **********
? Please enter your Bandwidth account ID. 1234567
Your credentials have been saved. You can now start using the CLI.
```

## Getting started
First time users should use the `quickstart` command to get started. You can use `quickstart` to order a number, or
simply setup your account (and order numbers later).

```
>bandwidth quickstart
An address is required for this quickstart.
? Please enter address line 1. (example: 900 Main Campus Dr)
>900 Main Campus Dr
? Please enter the city, state, and ZIP, each seperated by a comma and a space. (example: Raleigh, NC, 27606)
>Raleigh, NC, 27606
? Please enter a message callbackUrl. Information about sent messages will be sent here. (example: http://example.com)
>http://example.com
Messaging application created with id b01b1a3d-230a-467a-b143-3974fccc1ad0
Site created with id 37390
Sip Peer created with id 624642
? order a phone number?
>Yes
? Found 10 numbers. Choose which to order.
 (*) 9195007741
 (*) 9195181224
>(*) 9195182893
 ( ) 9195182967
 ( ) 9195784173
 ( ) 9196703710
 ( ) 9197060281
(Move up and down to reveal more choices)
? order 3 phone numbers? Yes
Your order was placed. Awaiting order completion...

setup successful. To order more numbers using this setup, use "bandwidth order category <quantity>" or "bandwidth order search <quantity>"

orderDate: 2020-07-10T22:03:45.475Z
note: Created a new number order for 3 numbers from RALEIGH, NC
status: COMPLETE
```
At this point, you can now use the number for messages. Should you need more (or different) numbers than
the 10 that were offered, you can order more numbers using the `bandwidth order`. For more information, see
[the `bandwidth order` command](#order)

## commands
[create](#create) [default](#default) [delete](#delete) [list](#list) [login](#login) [order](#order) [quickstart](#quickstart)

### create
used to create sites(also known as sub-accounts), sip peers (also known as locations), applications.
<!---FIXME: addressType should be address-type -->
#### create site

usage: `create site <sitename>`


switches/options
| name      | Description | required |
| ----------- | ----------- | ----------- |
| --address-type, -t| must be either billing or service.| yes

```
>create site --address-type billing "my site name"
Site created. See details of your created Site below.

id: 37390
name: my site name
address:
  houseNumber: 900
  streetName: MAIN CAMPUS
  streetSuffix: DR
  city: RALEIGH
  stateCode: NC
  zip: 27606
  plusFour: 5177
  country: United States
  addressType: Billing
>create site --address-type serviec "my site name"
Site created. See details of your created Site below.

id: 37391
name: my site name
address:
  houseNumber: 900
  streetName: MAIN CAMPUS
  streetSuffix: DR
  city: RALEIGH
  stateCode: NC
  zip: 27606
  plusFour: 5177
  country: United States
  addressType: Service
```

#### create sip peer
Create a sip peer (also known as location). Since all sip peers are nested under sub-accounts/sites,
a siteId must be specified if no default site is set.

This command will automatically turn on sms and link the default application to the site as a messaging application. If the
default application is a voice application, there will be an error.

usage: `create sippeer <peername>`


switches/options
| name      | Description | required |
| ----------- | ----------- | ----------- |
| --site-id, -s| A valid siteId to put the peer under.| no (yes if no default site is configured.)
| --default, -d| Make this a default sip peer under the site.| no

```
>create peer "my peer name"
Using default site 37397
Peer created successfully...
enabled SMS by default.
Linked created Sip Peer to default application 2065a8e4-20a7-4ec7-9e85-a1944fc5ad4c
Sip Peer created. See details of your created Peer below.

peerId: 624651
peerName: "my peer name"
isDefaultPeer: false
voiceHosts: 0
voiceHostGroups: 0
products:
  product: TERMINATION
id: 624651
siteId: 37397

or, manually specify siteId

>create peer --site-id mysiteId peername
Peer created successfully...
enabled SMS by default.
Linked created Sip Peer to default application 2065a8e4-20a7-4ec7-9e85-a1944fc5ad4c
Sip Peer created. See details of your created Peer below.

peerId: 624651
peerName: peername
isDefaultPeer: false
voiceHosts: 0
voiceHostGroups: 0
products:
  product: TERMINATION
id: 624651
siteId: 37397
```

#### create application
Create a voice or messaging application.

usage: `create app --type <type> <appname>`


switches/options
| name      | Description | required |
| ----------- | ----------- | ----------- |
| --type, -t| Specify whether the application is voice or messaging.| yes

```
create a messaging application

>bandwidth create application --type messaging appname
? Please enter a message callbackUrl. Information about sent messages will be sent here. (example: http://example.com)
>http://example.com
Messaging application created. See details of your created application below.

applicationId: 2c9a96e7-0869-4a6c-94b7-ad39c15db38a
serviceType: Messaging-V2
appName: appname
callbackUrl: http://example.com
msgCallbackUrl: http://example.com
callbackCreds: 0
```

or create a voice application

```
>bandwidth create application --type voice appname
? Please enter a callInitiatedCallbackUrl. Information for outbound calls will be sent here, and Bandwidth will attempt
to grab BXML at this endpoint. (example: http://example.com)
>http://example.com
Voice application created. See details of your created application below.

applicationId: cfa5dcf5-02ab-4451-af15-88548fa35777
serviceType: Voice-V2
appName: appname
callInitiatedCallbackUrl: http://example.com
callInitiatedMethod: POST

```

### delete
Delete sites(also known as sub-accounts), sip peers (also known as locations), applications.

#### delete sippeer
Delete a sippeer

usage: `delete peer [--force] <peer-id>`


switches/options
| name      | Description | required |
| ----------- | ----------- | ----------- |
| --siteId, -s| Specify the ID of the site that the peer is in| no (yes if no default site is configured.)

```
>bandwidth delete peer --siteId 37397 624651
Sip Peer successfully deleted.
```

#### delete application
Delete an application

usage: `delete app [--force] <app-id>`


switches/options
| name      | Description | required |
| ----------- | ----------- | ----------- |
| --force, -f| Delete the application even if it is linked to a peer/location.| no

```
>bandwidth delete app 241f63fe-4a46-4a64-893c-f71d775603b2
Application successfully deleted
```
