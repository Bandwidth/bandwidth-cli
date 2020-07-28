const printer = require('../printer');
const utils = require('../utils');
const { BadInputError } = require('../errors');
const path = require('path');
const fs = require('fs'); 
const copydir = require('copy-dir'); //fse is almost double the size of this entire CLI, apparently.

module.exports.codeCallbackServerAction = async (cmdObj) => {
  const opts = cmdObj.opts();
  const out = opts.out;
  const force = opts.force;
  const destPath = path.join(process.cwd(), out || `./bandwidth-callback-server`);
  const sourcePath = path.join(__dirname, `../../assets/server/node`);
  if (fs.existsSync(destPath) && !force) {
    throw new BadInputError(`The destination folder, ${destPath}, alraedy exists.`, 'out', 'Write to a new directory, or use --force to overwrite the existing directory.')
  }
  copydir.sync(sourcePath, destPath, {cover:true})
  printer.success(`Server generated successfully in ${destPath}`)
  const indexFileLocation = path.join(destPath, `index.js`) //TODO add support for other languages
  const defaultAppId = await utils.readDefault('application');
  if (defaultAppId){
    utils.replaceFile(indexFileLocation, [/INSERT YOUR MESSAGING APPLICATION ID HERE./g, defaultAppId]);
  } else {
    printer.warn(`No default messaging application detected. You will need to change the application ID inside ${out}/index.js to send message callbacks to the appropriate location.`)
  }
  printer.print('See the readme: https://github.com/Bandwidth/bandwidth-cli/blob/develop/assets/server/node/README.md')
}

module.exports.codeSampleAppAction = async (cmdObj) => { //FIXME: DRY violated.
  const opts = cmdObj.opts();
  const out = opts.out;
  const force = opts.force;
  const destPath = path.join(process.cwd(), out || `./bandwidth-sample-app`);
  const sourcePath = path.join(__dirname, `../../assets/sample-app/node`);
  if (fs.existsSync(destPath) && !force) {
    throw new BadInputError(`The destination folder, ${destPath}, alraedy exists.`, 'out', 'Write to a new directory, or use --force to overwrite the existing directory.')
  }
  copydir.sync(sourcePath, destPath)
  printer.success(`Server generated successfully in ${destPath}`)
  const indexFileLocation = path.join(destPath, `index.js`) //TODO add support for other languages
  const defaultAppId = await utils.readDefault('application');
  const defaultSiteId = await utils.readDefault('site');
  const defaultPeerId = await utils.readDefault('sippeer');
  if (defaultAppId){
    utils.replaceFile(indexFileLocation, [
      [/INSERT YOUR MESSAGING APPLICATION ID HERE./g, defaultAppId],
      [/INSERT YOUR SITE ID HERE./g, defaultSiteId],
      [/INSERT YOUR SIP PEER ID HERE./g, defaultPeerId]
    ]);
  } else {
    printer.warn(`No default messaging application detected. You will need to change the application ID inside ${out}/index.js to send message callbacks to the appropriate location.`)
  }
  printer.print('See the readme: https://github.com/Bandwidth/bandwidth-cli/blob/master/assets/sample-app/node/README.md')
}
