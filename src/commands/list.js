const utils = require('../api-utils');
const numbers = require("@bandwidth/numbers");



module.exports.listAppAction = async () => {
  const appList = await utils.listApplications();
  console.log(appList)
}

module.exports.listSiteAction = async () => {
  try {
    const sitesList = await numbers.Site.listAsync()
    console.log(sitesList) //FIXME probably make a table here.
  } catch {
    console.log('an error has occured')
  }
  //list things
}

module.exports.listSipPeerAction = async (siteId, cmdObj) => {
  const sipPeerList = await numbers.SipPeer.listAsync(siteId)
  console.log(sipPeerList)
}
