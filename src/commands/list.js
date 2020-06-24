const numbers = require("@bandwidth/numbers");



module.exports.listAppAction = async () => {
  const appList = await numbers.Application.listAsync();
  printer.printTable(appList)
}

module.exports.listSiteAction = async () => {
  try {
    const sitesList = await numbers.Site.listAsync()
    printer.printTable(sitesList);
  } catch {
    console.log('an error has occured')
  }
  //list things
}

module.exports.listSipPeerAction = async (siteId, cmdObj) => {
  const sipPeerList = await numbers.SipPeer.listAsync(siteId)
  printer.printTable(sipPeerList)
}
