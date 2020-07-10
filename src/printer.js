var colors = require('colors/safe');
const inquirer = require('inquirer');
const YAML = require('yaml');
const promptLibrary = require('../assets/prompts');
//Be very cautious about requiring anything, due to dircular dependencies

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
module.exports.error = (...errors) => {
  console.error(...errors.map(error => colors.red(error)));
  process.exit(1);
}
/**
 * A warning that does not immediately terminate the program.
 */
module.exports.warn = (...warnings) => {
  console.warn(...warnings.map(warning => colors.yellow(warning)));
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
module.exports.reject = (...messages) => {
  console.error(...messages.map(message => colors.brightRed(message)));
  process.exit(0)
}

/**
 * Inquire and asynchronously return the response.
 * @param promptNames a list of promptNames to be used by inquirer, found in prompts.js
 * @param args the arguments to each prompt, passed in as a list. args[0], for example, is the args for prompt 1.
 */
module.exports.prompt = async (promptNames, ...args) => {
  if (!Array.isArray(promptNames)) {
    promptNames = [promptNames];
  }
  let prompts = promptNames.map(promptName => promptLibrary[promptName]);
  if (!prompts.every(a => a)) {
    return module.exports.error('internal error: prompt not found');
  }
  prompts.forEach((prompt, i) => {
    if (args[i]) {
      if (!(prompt instanceof Function)) {
        return module.exports.error('internal error: attempted to assign argument to prompt.');
      }
      prompts[i] = prompt(args[i])
    }
  });
  if (prompts.some(prompt => prompt instanceof Function)) {
    return module.exports.error('A prompt is missing argument calls.');
  }
  return await inquirer.prompt(prompts);
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
  const {client, ...copy} = jsObj;
  module.exports.printObj(copy)
}

/**
 * Print something successful, in green.
 */
module.exports.success = (...messages) => {
  console.log(...messages.map(message => colors.green(message)));
}

/**
 * Print something only if toPrint is true, for verbose/quiet cases.
 */
module.exports.printIf = (toPrint, ...messages) => {
  if (toPrint) {
    console.log(...messages);
  }
}

/**
 * Create a custom printer function.
 * @param color the color to print with
 * @param exitcode the code to exit with. Will not exit if it's not an integer
 */
module.exports.custom = (color='white', exitcode=false, type='log') => {
  const ret = (...messages) => {
    console[type](...messages.map(message => colors[color](message)));
    if (typeof exitcode === 'number') {
      process.exit(exitcode)
    }
  }
  return ret;
}

/**
 * A normal log statement. Can be changed if needed.
 */
module.exports.print = console.log
