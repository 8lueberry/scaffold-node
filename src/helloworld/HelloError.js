const { AppError } = require('../AppError');

/* istanbul ignore next */
class HelloError extends AppError {
  constructor({ innerError }) {
    super({
      // internal error code https://nodejs.org/api/errors.html#errors_error_code
      code: 'ERR_HELLOWORLD_NAME_ERROR',
      // http return status code
      httpStatusCode: 403,
      // error message
      message: 'This is a sample hello error',
      // innerError can be passed for the stack to show
      innerError,
    });
  }
}

module.exports = {
  HelloError,
};
