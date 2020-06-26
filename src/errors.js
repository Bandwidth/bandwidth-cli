const printer = require('./printer')
class CliError extends Error {
  constructor(message, name) {
    super(message)
    this.name = name;
    Error.captureStackTrace(this, CliError);
  }
}

class ApiError extends CliError {
  /**
   * @classdesc An error related to a 400-level response from the API.
   * @constructor
   * @param res the http packet with the response
   */
  constructor(res) {
    const message = (res.body.indexOf('<Description>') >= 0)?
      res.body.split('<Description>').pop().split('</Description>')[0]:
      "An unknown error occured."
    super(message, res.status);
    this.res = res;
    Error.captureStackTrace(this, ApiError);
  }
}

class BadInputError extends CliError {
  /**
   * @classdesc An error related to a bad user input.
   * @constructor
   * @param field the name of the input field which is malformed.
   */
  constructor(message, name, field) {
    super(message, name);
    this.field = field;
    Error.captureStackTrace(this, BadInputError);
  }
}

/**
 * A wrapper around action functions to handle their errors.
 * @param action the async action function to catch errors for.
 */
const errorHandler = (action) => {
  return async (...args) => {
    await action(...args).catch((err) => {
      if (err instanceof BadInputError) {
        return printer.reject(err)
      }
      printer.error(err)
    });
  }
}

module.exports = {
  CliError: CliError,
  ApiError: ApiError,
  BadInputError: BadInputError,
  errorHandler: errorHandler
}
