const numbers = require("@bandwidth/numbers");
const printer = require('../printer')
const { ApiError, errorHandler } = require('../errors');

module.exports.listAppAction = async () => {
  const appList = await numbers.Application.listAsync().catch((err) => {throw new ApiError(err)});;
  printer.table(appList, {
    fields: ['applicationId', 'serviceType', 'appName'],
    key: 'applicationId'
  });
}

module.exports.listSiteAction = async () => {
  const sitesList = await numbers.Site.listAsync().catch((err) => {throw new ApiError(err)});
  printer.table(sitesList, {
    fields: ['id', 'name', 'sipPeerCount'],
    key: 'id'
  });
}

module.exports.listSipPeerAction = async (siteId, cmdObj) => {
  const sipPeerList = await numbers.SipPeer.listAsync(siteId).catch((err) => {throw new ApiError(err)});
  printer.table(sipPeerList, {
    fields: ['peerId', 'peerName', 'isDefaultPeer'],
    key: 'peerId'
  })
}
