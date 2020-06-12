const axios = require('axios');
const xmlToJs = require('fast-xml-parser');
const jsToXml = new xmlToJs.j2xParser();
const IRIS_BASE_URL = 'https://dashboard.bandwidth.com/api/';
const TEST_URL = 'https://webhook.site/f503b77a-0bde-49f9-a49b-878d64c992de';
const ACCOUNT_ID = process.env.BANDWIDTH_ACCOUNT_ID;
const API_USER = process.env.BANDWIDTH_API_USER;
const API_PASSWORD = process.env.BANDWIDTH_API_PASSWORD;
const auth = {
  username: this.API_USER,
  password: this.API_PASSWORD
};
const config = {
  headers: {
    'Content-Type': 'application/xml'
  },
  auth: this.auth
};


console.log(exports)

/**
 * Makes a request to the api to give a list of sites associated with the
 * accountID.
 */
listSites = () => {
  axios({
    method: "GET",
    url: IRIS_BASE_URL + `accounts/${accountId}/sites`,
    auth: this.auth
  }).then(res => {
    const xml = xmlToJs.parse(res.data);
    console.log(xml.SitesResponse.Sites.Site);
  }).catch(console.log)
}

/**
 * Accesses the iris api to create a site/subaccount.
 * @return the response. TODO: change to an object of the site or something.
 */
createSite = () => {
  const bodyObj = {
    Site: [{
      Name: 'Raleigh',
      Description: "Test description site",
      CustomerName: "Bandwidth CLI testing",
      Address: {
        HouseNumber: "1600",
        StreetName: "PENNSYLVANIA",
        StreetSuffix: 'AVE',
        PostDirectional: "NW",
        City: 'Washington',
        StateCode: 'DC',
        Zip: 20006,
        Country: 'US',
        AddressType: 'Billing'
      },
    }]
  }
  const url = IRIS_BASE_URL + `accounts/${accountId}/sites`;
  const data = new jsToXml().parse(bodyObj)
  axios.post(url, data, this.config)
  .then(res => {
    const jsRes = xmlToJs.parse(res.data);
    console.log(jsRes);
  }).catch(a => console.log(a.response.data))
}


/*LOCATIONS = SIPPEER*/

/**
 * Accesses the iris api to list all the locations associated with the accountID and
 * the specific site id.
 * @param siteId the id of the site that is being investigated.
 */
listSippeers = (siteId) => {
  const url = IRIS_BASE_URL +  `accounts/${accountId}/sites/${siteId}/sippeers`
  axios.get(url, this.config).then(res => console.log (res)).catch(err => console.log(err))
}

/*APPLICATIONS*/
listApplications = () => {
  axios({
    method: "GET",
    url: IRIS_BASE_URL + `accounts/${accountId}/applications`,
    auth: {
      username: process.env.BANDWIDTH_API_USER,
      password: process.env.BANDWIDTH_API_PASSWORD
    }
  }).then(res => {
    const xml = xmlToJs.parse(res.data).ApplicationProvisioningResponse.ApplicationList.Application;
    console.log(xml);
  }).catch(console.log)
}

/**
 * Accesses the iris api to create an application for messaging in particular.
 * @return the response.
 */
createMessageApplication = () => {
  const bodyObj = {
    Application: [{
      ServiceType: 'Messaging-V2',
      AppName: 'Application Name',
      MsgCallbackUrl: 'https://example.com',
      CallbackCreds: {
        UserId: 'testId',
        Password: 'testPass'
      }
    }],
  }
  const config = {
    headers: {
      'Content-Type': 'application/xml'
    },
    auth: {
      username: process.env.BANDWIDTH_API_USER,
      password: process.env.BANDWIDTH_API_PASSWORD
    }
  };
  const url = IRIS_BASE_URL + `accounts/${accountId}/applications`;
  console.log(url)
  const data = jsToXml.parse(bodyObj)
  axios.post(url, data, config)
  .then(res => {
    const jsRes = xmlToJs.parse(res.data).ApplicationProvisioningResponse.Application;
    console.log(res)
    console.log(jsRes);
  }).catch(a => console.log(a))
}

/**
 * Accesses the iris api to create an application for messaging in particular.
 * @return the response.
 */
createVoiceApplication = () => {
  const bodyObj = {
    Application: [{
      ServiceType: 'Voice-V2',
      AppName: 'Voice Application Name',
      CallInitiatedCallbackUrl: 'https://example.com',
      CallInitiatedMethod: 'GET',
      CallStatusCallbackUrl: 'https://example.com',
      CallStatusMethod: 'GET',
      CallbackCreds: {
        UserId: 'testId',
        Password: 'testPass'
      }
    }],
  }
  const url = IRIS_BASE_URL + `accounts/${accountId}/applications`;
  console.log(url)
  const data = jsToXml.parse(bodyObj)
  axios.post(url, data, this.config)
  .then(res => {
    const jsRes = xmlToJs.parse(res.data).ApplicationProvisioningResponse.Application;
    console.log(res)
    console.log(jsRes);
  }).catch(a => console.log(a))
}

module.exports.Api = Api;
