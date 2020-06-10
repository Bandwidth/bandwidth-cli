const axios = require('axios');
const IRIS_BASE_URL = 'https://dashboard.bandwidth.com/api/';
const accountId = process.env.BANDWIDTH_ACCOUNT_ID;
const listApplications = () => {
  axios({
    method: "GET",
    url: IRIS_BASE_URL + `accounts/${accountId}/applications`,
    auth: {
      username: process.env.BANDWIDTH_API_USER,
      password: process.env.BANDWIDTH_API_PASSWORD
    }
  }).then(res => {
    const parser = new DOMParser();
    const xml = parser.parseFromString(res.data);
    console.log(xml);
  }).catch(console.log)
}
listApplications();
