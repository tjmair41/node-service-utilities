const xss = require("xss");

const statusType = {
  SUCCESS: 'success',
  ERROR: 'error',
  VALID: 'valid',
  INVALID: 'invalid',
  AUTHORIZED: 'authorized',
  UNAUTHORIZED: 'unauthorized',
  CONFLICT: 'conflict',
  NOT_FOUND: 'not-found',
};

class Response {
  constructor(status, message) {
    this.status = status;
    this.message = message;
  }

  toJsonApiResponse() {
    return { status: this.status, message: xss(this.message) };
  }
}

class ErrorResponse extends Response {
  constructor(status, message, stacktrace) {
    super(status, message);
    this.stacktrace = stacktrace;
  }
}

class SQLErrorResponse extends ErrorResponse {
  constructor(error) {
    super(statusType.ERROR, `SQL Exception (${error.code}): ${error.message}`, error.stack);
  }
}

module.exports = {
  statusType,
  Response,
  ErrorResponse,
  SQLErrorResponse,
};
