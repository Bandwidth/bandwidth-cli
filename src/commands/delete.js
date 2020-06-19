const utils = require('../api-utils');
const numbers = require("@bandwidth/numbers");



module.exports.deleteAppAction = async (appId) => {
  utils.deleteApplication(appId)
}

module.exports.deleteSiteAction = async (siteId) => {
  const site = await numbers.Site.getAsync(siteId);
  const res = await site.deleteAsync(); //FIXME: I can also just create a new Site(), site.id = id, and then site.deleteAsync
  console.log(res)
}

module.exports.deleteSipPeerAction = async (siteId, cmdObj) => {

}
