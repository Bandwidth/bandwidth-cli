const numbers = require('@bandwidth/numbers');
const printer = require('../printer')


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
      printer.warn(`Unlinking your application with Sip Peer ${peer.id}`);
      await peer.removeApplicationsAsync()
    }
    printer.print();
  }
  app.deleteAsync().then(() => {
    printer.print('Application successfully deleted')
  })
}

module.exports.deleteSiteAction = async (siteId, cmdObj) => {
  const opts = cmdObj.opts();
  const force = opts.force;
  const site = await numbers.Site.getAsync(siteId);
  if (force) {
    const associatedSipPeers = await site.getSipPeersAsync()
    for await (sipPeer of associatedSipPeers) {
      await sipPeer.deleteAsync(); //Waiting like this is really slow, but how else to guarantee that it waits enough before deleting the site?
      printer.warn(`Deleting Sip Peer ${sipPeer.id}`)
    }
  }
  const res = await site.deleteAsync().then( _ => printer.print('Site successfully deleted.')); //IDEA: I can also just create a new Site(), site.id = id, and then site.deleteAsync. Decide which is better.
}

module.exports.deleteSipPeerAction = async (peerId, cmdObj) => {
  const siteId = cmdObj.opts().siteId;
  const sipPeer = await numbers.SipPeer.getAsync(siteId, peerId);
  sipPeer.deleteAsync().then(_ => printer.print('Sip Peer successfully deleted.'));
}
