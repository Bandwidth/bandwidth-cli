const axios = require('axios');
const xmlToJs = require('fast-xml-parser');
const jsToXml = new xmlToJs.j2xParser();
const IRIS_BASE_URL = 'https://dashboard.bandwidth.com/api/';
const TEST_URL = 'https://webhook.site/f503b77a-0bde-49f9-a49b-878d64c992de';
const ACCOUNT_ID = process.env.BANDWIDTH_ACCOUNT_ID;
const API_USER = process.env.BANDWIDTH_API_USER;
const API_PASSWORD = process.env.BANDWIDTH_API_PASSWORD;
const auth = {
  username: API_USER,
  password: API_PASSWORD
};
const config = {
  headers: {
    'Content-Type': 'application/xml'
  },
  auth: auth
};

/**
 * Given geocode information, attempts to apply geocoding to it through a
 * Bandwidth api.
 * @return a promise which resolves to the geocode
 */
module.exports.geocode = async (addressLine1, city, state, zip) => {
  const url =  IRIS_BASE_URL + `accounts/${ACCOUNT_ID}/geocodeRequest`
  const data = {RequestAddress: {
    AddressLine1: addressLine1,
    City: city,
    StateCode: state,
    Zip: zip
  }}
  const xmlData = jsToXml.parse(data);
  try {
    return await axios.post(url, xmlData, config).then(res => {
      return xmlToJs.parse(res.data).GeocodeRequestResponse.GeocodedAddress
    })
  } catch (err) {
    if (err.response.status === 409) {
      return xmlToJs.parse(err.response.data).GeocodeRequestResponse.GeocodedAddress
    } else {
      throw err;
    }
  }

}

/**
 * Makes a request to the api to give a list of sites associated with the
 * accountID.
 */
module.exports.listSites = () => {
  axios({
    method: "GET",
    url: IRIS_BASE_URL + `accounts/${ACCOUNT_ID}/sites`,
    auth: auth
  }).then(res => {
    const jsRes = xmlToJs.parse(res.data);
    console.log(jsRes.SitesResponse.Sites.Site);
  }).catch(console.log)
}

/**
 * Accesses the iris api to create a site/subaccount.
 * @param config an object of configurations for the site being created
 * @return a promise which resolves to the object representing the created site.
 */
module.exports.createSite = async (options) => {
  if (! (options.name && options.address)) {
    throw new Error('A name and address are required for a site.')
  }
  const data = {
    Site: [{
      Name: options.name,
      Description: options.description,
      CustomerName: options.customerName,
      Address: {
        ...options.address,
        AddressType: options.addressType,
      }
    }]
  }
  const url = IRIS_BASE_URL + `accounts/${ACCOUNT_ID}/sites`;
  const xmlData = jsToXml.parse(data)
  return await axios.post(url, xmlData, config).then(res => {
    const jsRes = xmlToJs.parse(res.data);
    return jsRes.SiteResponse.Site;
  })
}

/**
 * Deletes the site associated with a particular siteId.
 * @param siteId the id of the site that is being investigated.
 */
module.exports.deleteSite = (siteId) => {
  const url = IRIS_BASE_URL + `accounts/${ACCOUNT_ID}/sites/${siteId}`;
  axios.delete(url, config)
  .then(res => {
    console.log(res);
  }).catch(a => console.log(xmlToJs.parse(a.response.data).SiteResponse.ResponseStatus.Description))
}

/*LOCATIONS = SIPPEER*/

/**
 * Accesses the iris api to list all the locations associated with the accountID and
 * the specific site id.
 * @param siteId the id of the site that is being investigated.
 */
module.exports.listSippeers = (siteId) => {
  const url = IRIS_BASE_URL +  `accounts/${ACCOUNT_ID}/sites/${siteId}/sippeers`
  axios.get(url, config).then(res => {
    const js = xmlToJs.parse(res.data).TNSipPeersResponse.SipPeers;
    console.log(js);
  }).catch(err => console.log(err))
}

/**
 * Creates a sipper under the given siteId.
 * @return the js object representing the created site.
 */
module.exports.createSippeer = async (siteId) => {
  const url = IRIS_BASE_URL +  `accounts/${ACCOUNT_ID}/sites/${siteId}/sippeers`
  const data = {
    SipPeer: {
      PeerName: 'name2',
      Description: 'description',
      IsDefaultPeer: false,
      //FinalDestinationUri: 'uri',
      VoiceHosts: {
        host: {
          HostName: '10.10.10.1',
        }
      },
      /*TerminationHosts: {
        TerminationHost: {
          HostName: '2.1.1.9',
          port: 60,
          CustomerTrafficAllowed: 'DOMESTIC'
        }
      },*/ //So this isn't allowed in the new API, but still in the example. Hmm.
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
      //PremiseTrunks: 'PremiseTrunks',
      //CallingName: ''
    }
  };
  const xmlData = jsToXml.parse(data);
  return await axios.post(url, xmlData, config)
    .then(res => {
      const jsRes = xmlToJs.parse(res.data);
      return jsRes;
    })
}

/**
 * Deletes the site associated with a particular siteId.
 * @param siteId the id of the site that is being investigated.
 */
module.exports.deleteSippeer = (siteId, sippeerId) => {
  const url = IRIS_BASE_URL + `accounts/${ACCOUNT_ID}/sites/${siteId}/sippeers/${sippeerId}`;
  axios.delete(url, config)
  .then(res => {
    console.log(res);
  }).catch(err => console.log(err.response.data))
}

/*APPLICATIONS*/
module.exports.listApplications = () => {
  axios({
    method: "GET",
    url: IRIS_BASE_URL + `accounts/${ACCOUNT_ID}/applications`,
    auth: {
      username: process.env.BANDWIDTH_API_USER,
      password: process.env.BANDWIDTH_API_PASSWORD
    }
  }).then(res => {
    const js = xmlToJs.parse(res.data).ApplicationProvisioningResponse.ApplicationList.Application;
    console.log(js);
  }).catch(console.log)
}

/**
 * Accesses the iris api to create an application for messaging in particular.
 * @return the response.
 */
module.exports.createMessageApplication = async () => {
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
  const url = IRIS_BASE_URL + `accounts/${ACCOUNT_ID}/applications`;
  console.log(url)
  const data = jsToXml.parse(bodyObj)
  return await axios.post(url, data, config)
    .then(res => {
      return xmlToJs.parse(res.data).ApplicationProvisioningResponse.Application;
    })
}

/**
 * Accesses the iris api to create an application for messaging in particular.
 * @return the response.
 */
module.exports.createVoiceApplication = async () => {
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
  const url = IRIS_BASE_URL + `accounts/${ACCOUNT_ID}/applications`;
  console.log(url)
  const data = jsToXml.parse(bodyObj)
  return await axios.post(url, data, config)
    .then(res => {
      return xmlToJs.parse(res.data).ApplicationProvisioningResponse.Application;
    })
}

/**
 * Deletes the site associated with a particular siteId.
 * @param appId the id of the application that is being deleted.
 */
module.exports.deleteApplication = (appId) => {
  const url = IRIS_BASE_URL + `accounts/${ACCOUNT_ID}/applications/${appId}`;
  axios.delete(url, config)
  .then(res => {
    if (res.status === 200) {
      console.log(`successfully deleted application ${appId}`)
    }
  }).catch(err => console.log(xmlToJs.parse(err.response.data).ApplicationProvisioningResponse.ResponseStatus.Description))
}
