/**
 * Breaking error that terminates the program.
 */
module.exports.error = (error) => {
  console.err(error);
  process.exit
}

/**
 * A warning that does not immediately terminate the program.
 */
module.exports.warn = (warning) => {

}

/**
 * Print the given array of js objects as a table.
 */
module.exports.printTable = (data, maxCols) => {
  console.log(data); //FIXME
}

/**
 * Reject bad user input and terminates the program.
 */
module.exports.reject = (message) => {

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
