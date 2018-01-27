const { AppError } = require('./AppError');

class ErrorWithCode extends AppError {
  /* istanbul ignore next: only exists for legacy */
  constructor(code, message) {
    super({ code, message });
    this.httpStatusCode = code;
  }
}

module.exports = {
  AppError,
  ErrorWithCode, // deprecated
};
