const utils = require('../api-utils');
const numbers = require("@bandwidth/numbers");



module.exports.deleteAppAction = async (appId) => {
  const app = await numbers.Application.getAsync(appId);
  app.deleteAsync().catch()
}

module.exports.deleteSiteAction = async (siteId, cmdObj) => {
  const opts = cmdObj.opts();
  const force = opts.force;
  const site = await numbers.Site.getAsync(siteId);
  if (force) {
    const associatedSipPeers = await site.getSipPeersAsync()
    for await (sipPeer of associatedSipPeers) {
      await sipPeer.deleteAsync(); //Waiting like this is really slow, but how else to guarantee that it waits enough before deleting the site?
    }
  }
  const res = await site.deleteAsync(); //FIXME: I can also just create a new Site(), site.id = id, and then site.deleteAsync
  console.log(res) //FIXME: if deleting site with sippeers, enable "force" that will unlink all.
}

module.exports.deleteSipPeerAction = async (peerId, cmdObj) => {
  const siteId = cmdObj.opts().siteId;
  const sipPeer = await numbers.SipPeer.getAsync(siteId, peerId);
  sipPeer.delete();
}
