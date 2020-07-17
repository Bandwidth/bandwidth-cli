const numbers = require("@bandwidth/numbers");
const printer = require('../printer')
const { throwApiErr, ApiError, BadInputError } = require('../errors');
const utils = require('../utils');
const fs = require('fs')
const stringify = require('csv-stringify');

module.exports.listAppAction = async () => {
  const appList = await numbers.Application.listAsync().catch(throwApiErr);;
  printer.table(appList, {
    fields: ['applicationId', 'serviceType', 'appName'],
    key: 'applicationId'
  });
}

module.exports.listSiteAction = async () => {
  const sitesList = await numbers.Site.listAsync().catch(throwApiErr);
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
  const sipPeerList = await numbers.SipPeer.listAsync(siteId).catch(throwApiErr);
  printer.table(sipPeerList, {
    fields: ['peerId', 'peerName', 'isDefaultPeer'],
    key: 'peerId'
  })
}

module.exports.listNumberAction = async (siteId, peerId, cmdObj) => {
  const opts = cmdObj.opts();
  const out = opts.out
  let tnsList = [];
  const getAllTns = async () => {
    const sites = await numbers.Site.listAsync().catch(throwApiErr);;
    const promises = [];
    for await (site of sites) {
      promises.push(getSiteTns(site));
    }
    return (await Promise.all(promises)).flat()
  }
  const getSiteTns = async (site) => {
    const sipPeers = await site.getSipPeersAsync().catch(throwApiErr);
    const promises = [];
    for await (peer of sipPeers) {
      promises.push(getPeerTns(peer));
    }
    return (await Promise.all(promises)).flat()
  }
  const getPeerTns = async (peer) => {
    try {
      const peerTns = await peer.getTnsAsync();
      if (!peerTns) {
        return [];
      }
      return (peerTns)
        .map(numberObj => {
          return {
            number: numberObj.fullNumber,
            sippeer: peer.id,
            site: peer.siteId,
          }
      });
    } catch (err) {
      if (err.status === 500) {
        //FIXME Known and common Iris bug. 
        printer.printIf(false, `a known error has been encountered for site ${peer.siteId} and peer ${peer.id}. No fixes available at this time.`);
      } else {
        throw new ApiError(err)
      }
    }

  }
  if (siteId === "*") {
    tnsList = await getAllTns();
  } else if (!peerId){ //numbers under a site
    const site = await numbers.Site.getAsync(siteId).catch((err) => {
      if (err.status === 404) {
        throw new BadInputError('A site with that ID was not found.', 'siteId', 'Check for typos in the site ID.', {res:err})
      }
      throw new ApiError(err)
    });
    tnsList = await getSiteTns(site);
  } else { //numbers under a peer
    const peer = await numbers.SipPeer.getAsync(siteId, peerId).catch((err) => {
      if (err.status === 404) {
        throw new BadInputError('An the Sip Peer was not found under a the specified site.', 'siteId/peerId', 'Check for typos in the site or sippeer IDs.', {res:err})
      }
      throw new ApiError(err)
    });
    tnsList = await getPeerTns(peer);
  }
  tnsList = tnsList.filter(numberEntry => numberEntry&&numberEntry.number);
  if (out === true) { //must be boolean
    printer.table(tnsList)
  } else if (out === 'stdout') { 
    printer.print(tnsList)
  } else if (out) { 
    console.log(stringify());
  }
}