var colors = require('colors/safe');
const inquirer = require('inquirer');

/**
 * This file is intended to make the output style of the entire CLI uniform. In
 * particular, it should handle the formatting and style of any and all output
 * that the CLI generates and shows the user. It also enables a possible "verbose"
 * or "quiet" switch, which is what nexmo is currently doing.
 * Please do not write to console outside of this method (and commander's defaults.)
 */

/**
 * Breaking error that terminates the program.
 */
module.exports.error = (error) => {
  console.error(colors.red(error));
  process.exit()
}
/**
 * A warning that does not immediately terminate the program.
 */
module.exports.warn = (warning) => {
  console.warn(colors.yellow(warning));
}

/**
 * Print the given array of js objects as a table.
 */
module.exports.printTable = (data, maxCols) => {
  console.log()
  console.log(data); //FIXME
  console.log()
}

/**
 * Reject bad user input and terminates the program.
 */
module.exports.reject = (message) => {
  console.error(colors.brightRed(message));
  process.exit()
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
  const message = err;//parse the response somehow
  module.exports.error(message)
}

/**
 * Print out javascript object.
 */
module.exports.printObj = (jsObj) => {
  console.log(jsObj)
}

/**
 * Print out javascript objects, removing the client if there is one.
 */
module.exports.removeClient = (jsObj) => {
  // FIXME: remove a clientfield
  module.exports.printObj(jsObj)
}

/**
 * A normal log statement. Can be changed if needed.
 */
module.exports.print = console.log
