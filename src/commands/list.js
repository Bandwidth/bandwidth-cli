const numbers = require("@bandwidth/numbers");
const printer = require('../printer')
const { ApiError, errorHandler } = require('../errors');

module.exports.listAppAction = async () => {
  const appList = await numbers.Application.listAsync();
  printer.table(appList, {
    fields: ['applicationId', 'serviceType', 'appName'],
    key: 'applicationId'
  });
}

module.exports.listSiteAction = async () => {
  try {
    const sitesList = await numbers.Site.listAsync()
    printer.table(sitesList, {
      fields: ['id', 'name', 'sipPeerCount'],
      key: 'id'
    });
  } catch (err){
    printer.error(err)
  }
}

module.exports.listSipPeerAction = async (siteId, cmdObj) => {
  const sipPeerList = await numbers.SipPeer.listAsync(siteId)
  printer.table(sipPeerList, {
    fields: ['peerId', 'peerName', 'isDefaultPeer'],
    key: 'peerId'
  })
}
