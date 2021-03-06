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
  const defaultAppId = await utils.readDefault('messageApp');
  if (defaultAppId){
    utils.replacePatternInFile(indexFileLocation, [/INSERT YOUR MESSAGING APPLICATION ID HERE./g, defaultAppId]);
  } else {
    printer.warn(`No default messaging application detected. You will need to change the application ID inside ${out}/index.js to send message callbacks to the appropriate location.`)
  }
  printer.print('See the readme: https://github.com/Bandwidth/bandwidth-cli/blob/master/assets/server/node/README.md')
}
