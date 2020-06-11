const axios = require('axios');
const xmlToJs = require('fast-xml-parser');
const jsToXml = new xmlToJs.j2xParser();
const IRIS_BASE_URL = 'https://dashboard.bandwidth.com/api/';
const TEST_URL = 'https://webhook.site/f503b77a-0bde-49f9-a49b-878d64c992de';
const accountId = process.env.BANDWIDTH_ACCOUNT_ID;
class Api {
  constructor() {
    this.API_USER = process.env.BANDWIDTH_API_USER;
    this.API_PASSWORD = process.env.BANDWIDTH_API_PASSWORD;
    this.ACCOUNT_ID = process.env.BANDWIDTH_ACCOUNT_ID;
  }

  /*SUBACCOUNTS = SITES*/

  /**
   * Makes a request to the api to give a list of sites associated with the
   * accountID.
   */
  listSites = () => {
    axios({
      method: "GET",
      url: IRIS_BASE_URL + `accounts/${accountId}/sites`,
      auth: {
        username: this.API_USER,
        password: this.API_PASSWORD
      }
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
    const config = {
      headers: {
        'Content-Type': 'application/xml'
      },
      auth: {
        username: process.env.BANDWIDTH_API_USER,
        password: process.env.BANDWIDTH_API_PASSWORD
      }
    };
    const url = IRIS_BASE_URL + `accounts/${accountId}/sites`;
    const data = new jsToXml().parse(bodyObj)
    axios.post(url, data, config)
    .then(res => {
      const jsRes = xmlToJs.parse(res.data);
      console.log(jsRes);
    }).catch(a => console.log(a.response.data))
  }


  /*LOCATIONS = SIPPEER*/


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
   * Accesses the iris api to create an application.
   * @return the response.
   */
  createMessageApplication = () => {
    const bodyObj = {
      Application: [{
        Service: 'Messaging-V2',
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

  //listApplications();
}

module.exports.Api = Api;
