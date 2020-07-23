const printer = require('../printer');
const utils = require('../utils');
const { BadInputError } = require('../errors');
const path = require('path');


module.exports.sampleCallbackServerCmd = async () => {
  const opts = cmdObj.opts();
  const out = opts.out;
  const filePath = path.join(process.cwd(), out || `./bandwidth-numbers.csv`);
  
  
}
