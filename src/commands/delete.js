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
  await utils.delApp(app, force);
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
  await utils.delSite(site, force);
  printer.print('Site successfully deleted.'); //IDEA: I can also just create a new Site(), site.id = id, and then site.deleteAsync. Decide which is better.
}

module.exports.deleteSipPeerAction = async (peerId, cmdObj) => {
  const opts = cmdObj.opts();
  const force = opts.force;
  const siteId = await utils.processDefault('site', opts.siteId);
  const sipPeer = await numbers.SipPeer.getAsync(siteId, peerId).catch((err) => {
    if (err.status === 404) {
      throw new BadInputError('An the Sip Peer was not found under a the specified site.', 'siteId/peerId', 'Check for typos in the site or sippeer IDs.', {res:err})
    }
    throw new ApiError(err)
  });
  await utils.delPeer(sipPeer, false)
  printer.print('Sip Peer successfully deleted.');
}
