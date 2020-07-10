# Bandwidth CLI
## Table of Contents
[table of contexts](##table-of-contents)
[setup](##installationsetup)

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
[the `bandwidth order` command](###order)

## commands
[create](###create) [default](###default) [delete](###delete) [list](###list) [login](###login) [order](###order) [quickstart](###quickstart)

### create
used to create sites(also known as sub-accounts), sip peers (also known as locations), applications.
<!---FIXME: addressType should be address-type -->
#### create site
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
```
create peer "my peer name"
create site --address-type serviec "my site name"
```
