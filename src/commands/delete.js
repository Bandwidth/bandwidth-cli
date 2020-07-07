const numbers = require('@bandwidth/numbers');
const printer = require('../printer');
const { ApiError, BadInputError } = require('../errors');
const utils = require('../utils');

module.exports.deleteAppAction = async (appId, cmdObj) => {
  const opts = cmdObj.opts();
  const force = opts.force;
  const app = await numbers.Application.getAsync(appId).catch((err) => {
    if (err.status === 404) {
      throw new BadInputError('An application with that appId was not found.', 'appId', '', {res:err})
    }
    throw new ApiError(err)
  });
  const associatedSipPeers = await app.getSipPeersAsync().catch((err) => {throw new ApiError(err)});
  if (force && associatedSipPeers) {
    for await (sipPeerData of associatedSipPeers) {
      let peer = new numbers.SipPeer();
      peer.id = sipPeerData.peerId;
      peer.siteId = sipPeerData.siteId;
      peer.client = new numbers.Client();
      printer.warn(`Unlinking your application with Sip Peer ${peer.id}`);
      await peer.removeApplicationsAsync().catch((err) => {throw new ApiError(err)});
    }
    printer.print();
  }
  app.deleteAsync().catch((err) => {throw new ApiError(err)});
  printer.print('Application successfully deleted')
}

module.exports.deleteSiteAction = async (siteId, cmdObj) => {
  const opts = cmdObj.opts();
  const force = opts.force;
  const site = await numbers.Site.getAsync(siteId).catch((err) => {
    if (err.status === 404) {
      throw new BadInputError('A site with that siteId was not found.', 'siteId', '', {res: err})
    }
    throw new ApiError(err)
  });
  if (force) {
    const associatedSipPeers = await site.getSipPeersAsync().catch((err) => {throw new ApiError(err)});
    associatedSipPeers.sort((peerA, peerB) => peerA.isDefaultPeer - peerB.isDefaultPeer)//delete default peer last
    for await (sipPeer of associatedSipPeers) {
      await sipPeer.deleteAsync().catch((err) => {throw new ApiError(err)}); //Waiting like this is really slow, but how else to guarantee that it waits enough before deleting the site?
      printer.warn(`Deleting Sip Peer ${sipPeer.id}`)
    }
  }
  const res = await site.deleteAsync().catch((err) => {throw new ApiError(err)});
  printer.print('Site successfully deleted.'); //IDEA: I can also just create a new Site(), site.id = id, and then site.deleteAsync. Decide which is better.
}

module.exports.deleteSipPeerAction = async (peerId, cmdObj) => {
  const siteId = await utils.processDefault('site', cmdObj.opts().siteId);
  const sipPeer = await numbers.SipPeer.getAsync(siteId, peerId).catch((err) => {
    if (err.status === 404) {
      throw new BadInputError('An the Sip Peer was not found under a the specified site.', 'siteId/peerId', 'Check for typos in the site of sippeer IDs.', {res:err})
    }
    throw new ApiError(err)
  });
  await sipPeer.deleteAsync().catch((err) => {throw new ApiError(err)});
  printer.print('Sip Peer successfully deleted.');
}
