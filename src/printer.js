var colors = require('colors/safe');
const inquirer = require('inquirer');
const YAML = require('yaml');

/**
 * This file is intended to make the output style of the entire CLI uniform. In
 * particular, it should handle the formatting and style of any and all output
 * that the CLI generates and shows the user. It makes future expandions, such
 * as "verbose" or "quiet" options, easier to implement.
 * Please do not write to console outside of this method (and commander's defaults.)
 */

/**
 * Breaking error that terminates the program.
 */
module.exports.error = (error) => {
  console.error(colors.red(error));
  process.exit(1);
}
/**
 * A warning that does not immediately terminate the program.
 */
module.exports.warn = (warning) => {
  console.warn(colors.yellow(warning));
}

/**
 * Print the given array of js objects as a table.
 * @param {Object[]} data An array of objects with the same fields
 * @param options Specify maxCols, the fields to print, and the field to use as keys in an array.
 */
module.exports.table = (data, options) => {
  if (options) {
    data = data.slice(0, options.maxCols); //also makes copy
    if (options.key) {
      const dataObj = {}; //const transformed = array.reduce((keyMap, {key, ...x}) => { keyMap[options.key] = x; return keyMap}, {}) //Doesn't work with string keys.
      data.map((entry) => {
        dataObj[entry[options.key]] = entry;
        delete entry[options.key];
      })
      options.fields = options.fields?options.fields.filter(elem => elem !== options.key):undefined;
      data = dataObj;
    }
    console.table(data, options.fields);
  } else {
    console.table(data);
  }
}

/**
 * Reject bad user input and terminates the program.
 */
module.exports.reject = (message) => {
  console.error(colors.brightRed(message));
  process.exit(0)
}

/**
 * Inquire and asynchronously return the response.
 * @param prompts a list of prompts to be used by inquirer
 */
module.exports.prompt = inquirer.prompt;

/**
 * Print out http request errors.
 */
module.exports.httpError = (err) => {
  const message = err;//FIXME: do in DX-1324
  module.exports.error(message)
}

/**
 * Print out javascript object in a more readable yml format.
 */
module.exports.printObj = (jsObj) => {
  console.log();
  console.log(YAML.stringify(jsObj))
}

/**
 * Print out javascript objects, removing the client if there is one.
 */
module.exports.removeClient = (jsObj) => {
  // FIXME: remove a clientfield
  const copy = {...jsObj};
  delete copy.client;
  module.exports.printObj(copy)
}

/**
 * Print something successful, in green..
 */
module.exports.success = (text) => {
  console.log(colors.green(text))
}


/**
 * A normal log statement. Can be changed if needed.
 */
module.exports.print = console.log
