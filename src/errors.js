const printer = require('./printer');

class CliError extends Error {
  constructor(message, name, suggestion='', context={}) {
    super(message)
    this.name = name;
    this.suggestion = suggestion;
    this.context=context;
    Error.captureStackTrace(this, CliError);
  }
}

class ApiError extends CliError {
  /**
   * @classdesc An error related to a 400-level response from the API.
   * @constructor
   * @param packet the http packet with the response
   */
  constructor(packet) {
    if (packet.constructor.name === 'BandwidthError') { //SDK error type
      printer.error(packet.toString())
    }
    const defaultSuggest = ApiError.errorCodeSuggest(packet.status)
    const message = (packet.response.res.text.indexOf('<Description>') >= 0)?
      packet.response.res.text.split('<Description>').pop().split('</Description>')[0]:
      "An unknown error occured."
    const suggestion = defaultSuggest;
    super(message, 'Error Code ' + packet.status.toString(), suggestion, {res: packet});
    Error.captureStackTrace(this, ApiError);
  }

  /**
   * Given an error code, checks to see if it's a common error code and create default
   * suggestion or messages.
   * @return a default suggestion for the error code.
   */
  static errorCodeSuggest = (code) => {
    const suggestions = {
      401: 'To set your API credentials, try "bandwidth login"',
      404: 'Check for typos in your account ID.'
    }
    return suggestions[code] || '';
  }
}

class BadInputError extends CliError {
  /**
   * @classdesc An error related to a bad user input.
   * @constructor
   * @param suggestion An optional suggestion for how to fix this error
   * @param field the name of the input field which is malformed.
   * @param context optional debugging context, not used during production.
   */
  constructor(message, field, suggestion='', context={}) {
    super(message, 'Bad Input', suggestion, context);
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
        printer.custom('brightRed')(err.name + ":", err.message)
        return printer.custom('yellow', true)(err.suggestion||'')
      }
      if (err instanceof ApiError) {
        printer.custom('red')(err.name + ":", err.message);
        return printer.custom('yellow', true)(err.suggestion||'')
      }
      if (err instanceof CliError) {
        return printer.error("An unknown internal error has occured. See the stack trace below.\n\n", err)
      }
      throw err;
    });
  }
}

module.exports = {
  CliError: CliError,
  ApiError: ApiError,
  BadInputError: BadInputError,
  errorHandler: errorHandler
}
