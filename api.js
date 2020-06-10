const axios = require('axios');
const xmlToJs = require('fast-xml-parser');
const jsToXml = xmlToJs.j2xParser;
const IRIS_BASE_URL = 'https://dashboard.bandwidth.com/api/';
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

  createSite = () => {
    const bodyObj = {
      string:'string'
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
    //const url = 'https://webhook.site/f503b77a-0bde-49f9-a49b-878d64c992de';
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
      const xml = xmlParser.parse(res.data).ApplicationProvisioningResponse.ApplicationList.Application;
      console.log(xml);
    }).catch(console.log)
  }

  //listApplications();
}

module.exports.Api = Api;
