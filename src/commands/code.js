const printer = require('../printer');
const utils = require('../utils');
const { BadInputError } = require('../errors');
const path = require('path');
const fs = require('fs'); 
const copydir = require('copy-dir'); //fse is almost double the size of this entire CLI.

module.exports.codeCallbackServerAction = async (cmdObj) => {
  const opts = cmdObj.opts();
  const out = opts.out;
  const force = opts.force;
  const destPath = path.join(process.cwd(), out || `./bandwidth_callback_server`);
  const sourcePath = path.join(__dirname, `../../assets/server/node`);
  if (fs.existsSync(destPath) && !force) {
    throw new BadInputError(`The destination folder, ${destPath}, alraedy exists.`, 'out', 'Write to a new directory, or use --force to overwrite the existing directory.')
  }
  copydir.sync(sourcePath, destPath)
  printer.success('Server generated successfully. To ')
}
