const utils = require('../api-utils');
const numbers = require("@bandwidth/numbers");



module.exports.deleteAppAction = async (appId) => {
  const app = await numbers.Application.getAsync(appId);
  app.deleteAsync()
}

module.exports.deleteSiteAction = async (siteId) => {
  const site = await numbers.Site.getAsync(siteId);
  const res = await site.deleteAsync(); //FIXME: I can also just create a new Site(), site.id = id, and then site.deleteAsync
  console.log(res) //FIXME: if deleting site with sippeers, enable "force" that will unlink all.
}

module.exports.deleteSipPeerAction = async (peerId, cmdObj) => {
  const siteId = cmdObj.opts().siteId;
  const sipPeer = await numbers.SipPeer.getAsync(siteId, peerId);
  sipPeer.delete();
}
