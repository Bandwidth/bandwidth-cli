var colors = require('colors/safe');

/**
 * This file is intended to make the output style of the entire CLI uniform. In
 * particular, it should handle the formatting and style of any and all output
 * that the CLI generates and shows the user. Please do not write to console
 * outside of this method (and commander's defaults.)
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
 */
module.exports.prompt = async (prompts) => {

}

/**
 * Print out http requests.
 */
module.exports.http = (res) => {
  console.log(res);
}

/**
 * A normal log statement. Can be changed if needed. 
 */
module.exports.print = console.log
