const utils = require('../api-utils');
const numbers = require("@bandwidth/numbers");



module.exports.deleteAppAction = async (appId, cmdObj) => {
  const opts = cmdObj.opts();
  const force = opts.force;
  const app = await numbers.Application.getAsync(appId);
  const associatedSipPeers = await app.getSipPeersAsync();
  if (force && associatedSipPeers) {
    for await (sipPeerData of associatedSipPeers) {
      let peer = new numbers.SipPeer();
      peer.id = sipPeerData.peerId;
      peer.siteId = sipPeerData.siteId;
      peer.client = new numbers.Client();
      await peer.removeApplicationsAsync()
    }
  }
  app.deleteAsync()
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
  const res = await site.deleteAsync(); //TODO: I can also just create a new Site(), site.id = id, and then site.deleteAsync. Decide which is better.
  console.log(res)
}

module.exports.deleteSipPeerAction = async (peerId, cmdObj) => {
  const siteId = cmdObj.opts().siteId;
  const sipPeer = await numbers.SipPeer.getAsync(siteId, peerId);
  sipPeer.delete();
}
