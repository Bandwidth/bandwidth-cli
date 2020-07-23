const printer = require('../printer');
const utils = require('../utils');
const { BadInputError } = require('../errors');
const path = require('path');
const fs = require('fs');


module.exports.codeCallbackServerAction = async (cmdObj) => {
  const opts = cmdObj.opts();
  const out = opts.out;
  const force = opts.force;
  const destPath = path.join(process.cwd(), out || `./bandwidth_callback_server.js`);
  const sourcePath = path.join(__dirname, out || `../../assets/server/node.js`);
  try {
    fs.copyFileSync(sourcePath, destPath, force?0:fs.constants.COPYFILE_EXCL)
  } catch {
    throw new BadInputError(`The destination file, ${destPath}, alraedy exists.`, 'out', 'Write to a new file, or use --force to overwrite the existing file')
  }
}
