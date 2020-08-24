# Bandwidth CLI
This CLI allows you to order phone numbers and create the necessary [Bandwidth applications](https://dev.bandwidth.com/account/applications/about.html) to quickly setup your development environment and callback
settings with Bandwidth. In addition, this quick-setup automates the necessary steps required to order
your first number with Bandwidth.

These quick-setup configurations are stored in the CLI and automatically used in any
orders that are placed through the CLI.

Expected workflow: [setup](#installationsetup), then [quickly set up your account](#gettingstarted). 

## Table of Contents
- [table of contents](#table-of-contents)
- [setup](#installationsetup)
- [getting started with Bandwidth](#getting-started-with-bandwidth)

### List of CLI Commands
| command   | Description |
| ----------- | ----------- |
|[create](#create)|Create sip peers/locations, sites/sub-accounts, and applications
|[default](#default)|Manage default sip peers/locations, sites/sub-accounts, messaging applications, and number
|[delete](#delete)| Delete sip peers/locations, sites/sub-accounts, and applications
|[list](#list)| List sip peers/locations, sites/sub-accounts, applications, and numbers associated with sites and sip peers
|[login](#login)| Login to your bandwidth account to use this tool
|[message](#message)| Send a text message through Bandwidth
|[order](#order)|Order phone numbers
|[quickstart](#quickstart)|Set up your account quickly and process details automatically

## Installation/Setup
This Bandwidth CLI uses nodeJs version 12. If node is not installed on your computer, visit https://nodejs.org/en/download/ for installation instructions for node. If you have node, check your version with `node -v`

With node on your machine, install the package globally through npm (or yarn)
```
npm install -g @bandwidth/cli

or

yarn global add @bandwidth/cli
```

log into your bandwidth account by specifying your account id, and your dashboard username and password. 
**The account should be a messaging account. Other account types, such as voice or 911, are currently not supported.**


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
setup, or simply setup your account (and order numbers later). `quickstart` can be used as many times as needed, and will automatically set up a new site, sippeer, and application without interacting with or influencing existing account settings. 

*Note: quickstart will often fail if multiple CLIs were used, as no duplicate names are allowed for messaging applications. To specify a messaging application name, use `bandwidth quickstart --custom`

![Callbacks and bandwidth](https://dev.bandwidth.com/images/bandwidth_callbacks.png)
More information about callback urls can be found at https://dev.bandwidth.com/guides/callbacks/callbacks.html

```
>bandwidth quickstart
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

orderDate: 2020-07-10T22:03:45.475Z
note: Created a new number order for 3 numbers from RALEIGH, NC
status: COMPLETE
telephoneNumbers:
  - "9195007741"
  - "9195181224"
  - "9195182893"

setup successful. To order more numbers using this setup, use "bandwidth order category <quantity>" or "bandwidth order search <quantity>"

```
At this point, you can now use the number for [messages](https://dev.bandwidth.com/messaging/methods/messages/createMessage.html) or [SDKs](https://dev.bandwidth.com/sdks/about.html). Should you need more (or different) numbers than the 10 that were offered, you can order more numbers using [`bandwidth order`](#order).

## commands
[Commands Table of Contents](#list-of-cli-commands)

notes:
- `bandwidth <command> --help` is available in the cli for usage and flag notes. 
- `bw` is an alias for bandwidth. `bw order number 123456789` is a valid syntax for the cli.


### create
used to create sites(also known as sub-accounts), sip peers (also known as locations), applications.
#### create site

usage: `bandwidth create site <sitename>`


switches/options
| name      | Description | required |
| ----------- | ----------- | ----------- |
| --address-type, -t| must be either billing or service.| yes

```
>bandwidth create site --address-type billing "my site name"
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
>bandwidth create site --address-type service "my site name"
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

This command will automatically turn on sms and link the default messageApp to the site as a messaging application. 
Automatic voice application linking is not yet supported by this CLI and will result in an error.

usage: `bandwidth create sippeer <peername>`


switches/options
| name      | Description | required |
| ----------- | ----------- | ----------- |
| --site-id, -s| A valid site Id to put the peer under.| no (yes if no default site is configured.)
| --default, -d| Make this a default sip peer under the site. This is stored in your account and is **not** the same as the `bandwidth default` command.| no

```
>bandwidth create sippeer "my peer name"
Using default site 37397
Peer created successfully...
enabled SMS by default.
Linked created Sip Peer to default messageApp 2065a8e4-20a7-4ec7-9e85-a1944fc5ad4c
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

or, manually specify site Id

```
>bandwidth create sippeer --site-id mysiteId peername
Peer created successfully...
enabled SMS by default.
Linked created Sip Peer to default messageApp 2065a8e4-20a7-4ec7-9e85-a1944fc5ad4c
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
Create a voice or messaging application. Note that messaging applications cannot have duplicate names. 

usage: `bandwidth create app --type <type> <appname>`


switches/options
| name      | Description | required |
| ----------- | ----------- | ----------- |
| --type, -t| Specify whether the application is `voice` or `messaging`.| yes

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

**Note that defaults, as referred to in this CLI, is different from the default sip peer of a site, as referred to in the rest of the bandwidth API docs**

usage:
```
bandwidth default                                       //list all defaults
bandwidth default <default-field>                       //print the value of a particular default
bandwidth default <default-field> <default-value>       //set a new default
bandwidth default -d <default-field>                    //delete a default
```
Current accepted `default-field`s include `site`, `sippeer`, `messageApp`, and `number`. 

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

usage: `bandwidth delete site <site-id>`


switches/options
| name      | Description | required |
| ----------- | ----------- | ----------- |
| --force, -f| Force-delete the site and remove sip peers| no
| --verbose, -v| Increase verbosity of output when force deleting| no

```
>bandwidth delete site 37397
Site successfully deleted.
```

Or force delete all necessary components to delete the site, including all nested sip peers..

```
>bandwidth delete site 37731 --force --verbose
Phone numbers associated with sip peer 625370 have been disconnected        //applications are disconnected but not deleted.
Application unlinked from sip peer 625370
SMS deleted from sip peer 625370
Sip peer 625370 deleted.                                                    //Force deleting a site automatically removes all sip peers.
Site successfully deleted.
```

#### delete sippeer
Delete a sippeer

usage: `bandwidth delete sippeer <peer-id>`


switches/options
| name      | Description | required |
| ----------- | ----------- | ----------- |
| --site-id, -s| Specify the ID of the site that the peer is in| no (yes if no default site is configured.)
| --force, -f| Force delete by removing all numbers and settings.| no 
| --verbose, -v| Increase verbosity of output when force deleting| no

```
>bandwidth delete sippeer --site-id 37397 624651
Sip Peer successfully deleted.
```

Or force delete all necessary components to delete the peer.
```
>bandwidth delete peer --force --verbose --site-id 37731 625370
Phone numbers associated with sip peer 625370 have been disconnected        //applications are disconnected but not deleted.
Application unlinked from sip peer 625370
SMS deleted from sip peer 625370
Sip peer 625370 deleted.
```

#### delete application
Delete an application

usage: `bandwidth delete app <app-id>`


switches/options
| name      | Description | required |
| ----------- | ----------- | ----------- |
| --force, -f| Delete the application even if it is linked to a peer/location.| no

```
>bandwidth delete app 241f63fe-4a46-4a64-893c-f71d775603b2
Application successfully deleted
```

### list
List [sites](#list-site)(subaccounts), [sip peers](#list-peer)(locations), [applications](#list-application), or [numbers](#list-numbers) associated with certain sites/subaccounts. 

#### list site

usage: `bandwidth list site`


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

usage: `bandwidth list sippeer [site-id]`

Siteid is required unless a default site id is set, in which case the peers under the default
site will be listed instead.

switches/options
| name      | Description | required |
| ----------- | ----------- | ----------- |
|none|

```
>bandwidth list sippeer 45928
┌─────────┬──────────────────┬───────────────┐
│ (index) │     peerName     │ isDefaultPeer │
├─────────┼──────────────────┼───────────────┤
│ 624650  │ 'My Sip Peer 23' │     true      │
│ 624651  │    'peername'    │     false     │
└─────────┴──────────────────┴───────────────┘
```

#### list application

usage: `bandwidth list app`


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

#### list numbers
List all numbers and their associated siteId and sip peer id. You can search numbers globally, at the site level, or at the sip peer level. By default, the numbers will be turned into a csv and stored in the current working directory (cwd) under `bandwidth-numbers.csv`. 

CLI-level defaults are not used, so `*` or a `site-id` is required. 

usage:
```
bandwidth list numbers *                        //list all numbers under your account
bandwidth list numbers <site-id>                //list all numbers under a particular site
bandwidth list numbers <site-id> <peer-id>      //list all numbers under a specific peer
```


switches/options
| name      | Description | required |
| ----------- | ----------- | ----------- |
|--out, -o [relative-path]|specify the output's relative path. Prints a table to console if `relative-path` is not specified. Prints csv-formatted output to console if `relative-path` is `stdout`. Otherwise, saves the output to the file specified.|no
```
//get all numbers from the account
>bandwidth list numbers * 
Telephone number data successfully written to users/yourName/bandwidth-numbers.csv

//get all numbers from the site 48259
>bandwidth list numbers 48259 
Telephone number data successfully written to users/yourName/bandwidth-numbers.csv

//get all numbers from the site 48259, sip peer 342594
>bandwidth list numbers 48259 342594
Telephone number data successfully written to users/yourName/bandwidth-numbers.csv

//Print to console as a table using --out
>bandwidth list numbers 37656 --out
┌─────────┬──────────────┬─────────┬───────┐
│ (index) │    number    │ sippeer │ site  │
├─────────┼──────────────┼─────────┼───────┤
│    0    │ '5754041393' │ 625216  │ 37656 │
│    1    │ '5754894272' │ 625216  │ 37656 │
│    2    │ '5754895124' │ 625428  │ 37656 │
└─────────┴──────────────┴─────────┴───────┘

//print to console as raw csv data for piping
>bandwidth list numbers 37656 --out stdout
number,sippeer,site
5754041393,625216,37656
5754894272,625216,37656
5754895124,625216,37656

//save to a different file. 
>bandwidth list numbers 37656 --out my_file.csv
Telephone number data successfully written to users/your-name/your-cwd/my_file.csv

```
### login
usage: `bandwidth login`

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

### message
usage: `bandwidth message <number1> <number2> <number3, etc...>`

switches/options
| name      | Description | required |
| ----------- | ----------- | ----------- |
|--app-id, -a| Specify the application id to send a message under. | no (yes if no default site is configured.)
|--from-num, -n| Specify the number from which a number is sent. | no (yes if no default number is configured.)
|--quiet, -q| Suppress output. | no
```
>bandwidth message +15554443333 --from-num +17249200266
Using default messageApp 7d5f2e74-8488-458b-bb12-6df895ef6041
? Enter the message you would like to send below: Hello!
Message request placed. The following information passed to server:

id: 1595885144985y3yyewnagcem5hws
owner: "+17249200266"
applicationId: 7d5f2e74-8488-458b-bb12-6df895ef6041
time: 2020-07-27T21:25:44.985Z
segmentCount: 1
direction: out
to:
  - "+15554443333"
from: "+17249200266"
media: null
text: Hello!
tag: null

Warning: The message is not necessarily delivered. Callback information about the text should be accessed via a server. Set up a server for your default messageApp with "bandwidth code server".


//quietly
>bw message +15554443333 --from-num 7249200266 -q
? Enter the message you would like to send below: Hello!
Message request placed.

```

### order
Order phone numbers in three ways. Orders will be found under the specified sip peer. 
- [`order number`](#order-number): Order a list of specific numbers
- [`order category`](#order-category): Order a given quantity of numbers with a criteria
- [`order search`](#order-search): Search for numbers with a criteria and select those that you want to order


#### order number
usage: `bandwidth order number <phone-numbers...>`
switches/options
| name      | Description | required |
| ----------- | ----------- | ----------- |
|site-id| the site that the number will be tied to|no (yes if no default site is configured.)
|peer-id| the sip peer that the number will be tied to. if not specified, will use the site's built in default peer|no

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
usage: `bandwidth order category [order-parameters] <quantity>`

Orders a specified quantity of numbers based on a set of query parameters. At least one
query parameter is required. Use the switches/options below to specify query parameters.


switches/options
| name      | Description | required |
| ----------- | ----------- | ----------- |
|site-id| the site that the number will be tied to|no (yes if no default site is configured.)
|peer-id| the sip peer that the number will be tied to. if not specified, will use the site's built in default peer|no
|zip | the zip code of the number | no
|area-code| the area code of the number | no
|npa-nxx| the first 6 digits of the phone number | no
|npa-nxx-x| the first 7 digits of the phone numebr | no
|state| the state abbreviation of the number.  | no
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
usage: `bandwidth order search [order-parameters] <quantity>`

Finds a specified quantity of numbers based on a set of query parameters. At least one
query parameter is required. You may choose to order any number of the orders found.

Use the switches/options below to specify query parameters.


switches/options
| name      | Description | required |
| ----------- | ----------- | ----------- |
|site-id| the site that the number will be tied to|no (yes if no default site is configured.)
|peer-id| the sip peer that the number will be tied to. if not specified, will use the site's built in default peer|no
|zip | the zip code of the number | no
|area-code| the area code of the number | no
|npa-nxx| the first 6 digits of the phone number | no
|npa-nxx-x| the first 7 digits of the phone numebr | no
|state| the state abbreviation of the number.  | no
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


### quickstart
usage: `bandwidth quickstart`

Set up your account quickly and process details automatically to immediately enable number
ordering and development.


switches/options
| name      | Description | required |
| ----------- | ----------- | ----------- |
|-v, --verbose| Increase setup verbosity| no

```
>bandwidth quickstart
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

orderDate: 2020-07-10T22:03:45.475Z
note: Created a new number order for 3 numbers from RALEIGH, NC
status: COMPLETE
telephoneNumbers:
  - "9195007741"
  - "9195181224"
  - "9195182893"

setup successful. To order more numbers using this setup, use "bandwidth order category <quantity>" or "bandwidth order search <quantity>"

```
