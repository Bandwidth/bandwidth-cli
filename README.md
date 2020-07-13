# Bandwidth CLI
## Table of Contents
- [table of contents](#table-of-contents)
- [setup](#installationsetup)
- [getting started with Bandwidth](#gettingstarted)
- [commands](#commands)

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

## Getting Started With Bandwidth
First time users should use the `quickstart` command to get started. You can use `quickstart` to order a number without prior
setup, or simply setup your account (and order numbers later).

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
the 10 that were offered, you can order more numbers using [`bandwidth order`](#order).

## commands
| command   | Description |
| ----------- | ----------- |
|[create](#create)|Create sip peers/locations, sites/sub-accounts, and applications.
|[default](#default)|Manage default sip peers/locations, sites/sub-accounts, and applications.
|[delete](#delete)| Delete sip peers/locations, sites/sub-accounts, and applications.
|[list](#list)| List sip peers/locations, sites/sub-accounts, and applications.
|[login](#login)| login to your bandwidth account to use this tool
|[order](#order)|order phone numbers
|[quickstart](#quickstart)|set up your account quickly and process details automatically

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
```

or, manually specify siteId

```
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

### default
Set, view, and manage a default site(subaccount), sip peer (location), and application. Defaults are
used automatically for required fields if none are specified. For example, when [ordering](#order) a
number, the default site and sip peer will be used if none are specified.

usage:
```
default                                 //list all defaults
default <default-name>                  //print the value of a particular default
default <default-name> <default value>  //set a new default
default -d <default-name>               //delete a default
```

switches/options
| name      | Description | required |
| ----------- | ----------- | ----------- |
| --delete, -d| delete the settings of a default| no

```
>bandwidth default
sippeer: 837494
site: 30673
application: 48e92ba2-20a7-9f8a-9e85-a1944fc5ad4c


>bandwidth default site
30673

>bandwidth default site 12345
Default site set.

>bandwidth default site
12345

>bandwidth default site -d
Default site deleted

>bandwidth default
sippeer: 837494
application: 48e92ba2-20a7-9f8a-9e85-a1944fc5ad4c
```


### delete
Delete sites(also known as sub-accounts), sip peers (also known as locations), applications.

#### delete site
Delete a site

usage: `delete site [--force] <site-id>`


switches/options
| name      | Description | required |
| ----------- | ----------- | ----------- |
| --force, -f| Force-delete the site and remove sip peers| no

```
>bandwidth delete site 37397
Site successfully deleted.
```

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

### list
List sites(subaccounts), sip peers(locations), or applications

#### list site

usage: `list site`


switches/options
| name      | Description | required |
| ----------- | ----------- | ----------- |
|none|

```
>bandwidth list site

┌─────────┬──────────────────────────────────┬──────────────┐
│ (index) │               name               │ sipPeerCount │
├─────────┼──────────────────────────────────┼──────────────┤
│   123   │             'site1'              │      7       │
│   456   │          'site no two'           │      1       │
└─────────┴──────────────────────────────────┴──────────────┘
```
#### list peer

usage: `list peer [site-id]`

Siteid is required unless a default site id is set, in which case the peers under the default
site will be listed instead.

switches/options
| name      | Description | required |
| ----------- | ----------- | ----------- |
|none|

```
>bw l p 45928
┌─────────┬──────────────────┬───────────────┐
│ (index) │     peerName     │ isDefaultPeer │
├─────────┼──────────────────┼───────────────┤
│ 624650  │ 'My Sip Peer 23' │     true      │
│ 624651  │    'peername'    │     false     │
└─────────┴──────────────────┴───────────────┘
```

#### list application

usage: `list app`


switches/options
| name      | Description | required |
| ----------- | ----------- | ----------- |
|none|

```
>bandwidth list application

┌──────────────────────────────────────┬────────────────┬───────────────────────────────┐
│               (index)                │  serviceType   │            appName            │
├──────────────────────────────────────┼────────────────┼───────────────────────────────┤
│ 77762e2e-59ff-4fb4-8586-fee69f073ed9 │ 'Messaging-V2' │   'your cool messaging app'   │
│ ecbba874-6be3-41b9-a63f-20bbb1c9dc95 │   'Voice-V2'   │            'name'             │
└──────────────────────────────────────┴────────────────┴───────────────────────────────┘
```

### login
usage: `login`

switches/options
| name      | Description | required |
| ----------- | ----------- | ----------- |
|none|

```
>bandwidth login
Leaving a field blank will keep it at its previous value.
? Please enter your Bandwidth dashboard username myUsername
? Please enter your Bandwidth dashboard password. This will be securely stored. **********
? Please enter your Bandwidth account ID. 1234567
Your credentials have been saved. You can now start using the CLI.
```

### order
Order phone numbers in three ways
- [Order a list of specific numbers](#order-number)
- [Order a given quantity of numbers with a criteria](#order-category)
- [Search for numbers with a criteria and select those that you want to order](#order-search)


#### order number
usage: `order number <phone-numbers...>`
switches/options
| name      | Description | required |
| ----------- | ----------- | ----------- |
|site-id| the site of the number being ordered|no (yes if no default site is configured.)
|peer-id| the peer of the number being ordered. if not specified, will use the site's built in default peer|no

```
>bandwidth order numbers 4242064432 4242064617

4242064432
4242064617
? order 2 phone numbers?
>Yes
Your order was placed. Awaiting order completion...

orderDate: 2020-07-13T18:39:08.952Z
note: Created a new number order for 2 numbers from REDONDO, CA
status: COMPLETE
```

#### order category
usage: `order category [order-parameters] <quantity>`

Orders a specified quantity of numbers based on a set of query parameters. At least one
query parameter is required.


switches/options
| name      | Description | required |
| ----------- | ----------- | ----------- |
|site-id| the site of the number being ordered|no (yes if no default site is configured.)
|peer-id| the peer of the number being ordered. if not specified, will use the site's built in default peer|no
|zip | the zip code of the number | no
|area-code| the area code of the number | no
|npa-nxx| the first 6 digits of the phone number | no
|npa-nxx-x| the first 7 digits of the phone numebr | no
|state| the city of the number.  | no
|area-code| the LATA (Local Access and Transport Area) of the number | no
```
>bandwidth order category --state nc 5
You have selected the following:

state: nc

? order 5 numbers? Yes
Your order was placed. Awaiting order completion...

orderDate: 2020-07-13T19:31:44.093Z
note: Created a new number order for 5 numbers from (Multiple) Rate Centers
status: COMPLETE
telephoneNumbers:
  - "2525131647"
  - "2526426029"
  - "7043224179"
  - "7045503870"
  - "7045504093"
```

You can combine as many of these queries as you'd like.

```
>bandwidth order category --state nc --city raleigh --npa-nxx 919858 3
You have selected the following:

npaNxx: "919858"
state: nc
city: raleigh

? order 3 numbers?
>Yes
Your order was placed. Awaiting order completion...

orderDate: 2020-07-13T19:35:25.832Z
note: Created a new number order for 2 numbers from RALEIGH, NC
status: COMPLETE
telephoneNumbers:
  - "9198586910"
  - "9198586913"
```

#### order search
usage: `order search [order-parameters] <quantity>`

Finds a specified quantity of numbers based on a set of query parameters. At least one
query parameter is required. You may choose to order any number of the orders found.


switches/options
| name      | Description | required |
| ----------- | ----------- | ----------- |
|site-id| the site of the number being ordered|no (yes if no default site is configured.)
|peer-id| the peer of the number being ordered. if not specified, will use the site's built in default peer|no
|zip | the zip code of the number | no
|area-code| the area code of the number | no
|npa-nxx| the first 6 digits of the phone number | no
|npa-nxx-x| the first 7 digits of the phone numebr | no
|state| the city of the number.  | no
|area-code| the LATA (Local Access and Transport Area) of the number | no
```
>bandwidth order search --state nc 5
? Found 5 numbers. Choose which to order.
>(*) 7047091101
 ( ) 7047091161
 ( ) 7047091328
 ( ) 7047091233
 ( ) 7047091391
7047091101
7047091233
? order 2 phone numbers?
>Yes
Your order was placed. Awaiting order completion...

orderDate: 2020-07-13T19:37:57.740Z
note: Created a new number order for 2 numbers from ALTON, NC
status: COMPLETE
telephoneNumbers:
  - "7047091101"
  - "7047091233"
```

You can combine as many of these queries as you'd like.
```
>bandwidth order search--state nc --city raleigh --npa-nxx 919858 3
? Found 3 numbers. Choose which to order. 9198586910, 9198586913
9198586910
9198586913
? order 2 phone numbers? Yes
Your order was placed. Awaiting order completion...

orderDate: 2020-07-13T19:35:25.832Z
note: Created a new number order for 2 numbers from RALEIGH, NC
status: COMPLETE
telephoneNumbers:
  - "9198586910"
  - "9198586913"
```
