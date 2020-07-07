const numbers = require("@bandwidth/numbers");
const printer = require('../printer')
const { ApiError, BadInputError } = require('../errors');
const utils = require('../utils');

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
  siteId = await utils.processDefault('site', siteId)
  if (!siteId) {
    throw new BadInputError('Missing a Site ID', "siteId", "Specify a siteId using the --siteId switch, or set a default site using \"bandwidth default site <siteId>\"");
  }
  const sipPeerList = await numbers.SipPeer.listAsync(siteId).catch((err) => {throw new ApiError(err)});
  printer.table(sipPeerList, {
    fields: ['peerId', 'peerName', 'isDefaultPeer'],
    key: 'peerId'
  })
}
