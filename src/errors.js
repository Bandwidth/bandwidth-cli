class CliError extends Error {
  constructor(message) {
    super(message)
    this.name = 'CliError';
    Error.captureStackTrace(this, CliError);
  }
}

class ApiError extends CliError {
  /**
   * @classdesc An error related to a 400-level response from the API.
   * @constructor
   * @param res the http packet with the response
   */
  constructor(message, res) {
    super(message);
    this.res = res;
  }
}

/**
 * @classdesc An error related to a 400-level response from the API.
 * @constructor
 * @param field the name of the input field which is malformed.
 */
class BadInputError extends CliError {
  constructor(message, field) {
    super(message);
    this.field = field;
  }
}
