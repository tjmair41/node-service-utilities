const expect = require('chai').expect;
const responseClass = require('../../response.js');
const statusType = require('../../response.js').statusType;

describe('The response module', () => {
  it('should create response object with status and message', () => {
    const response = new responseClass.Response(statusType.SUCCESS, 'This is a successful message');
    expect(response.toJsonApiResponse()).to.deep.equal({ status: 'success', message: 'This is a successful message' });
  });

  it('should create a error response object with status, message, and stacktrace', () => {
    const response = new responseClass.ErrorResponse(statusType.ERROR, 'This is an error message', 'stack trace would go here');
    expect(response).to.deep.equal({ status: 'error', message: 'This is an error message', stacktrace: 'stack trace would go here' });
  });

  it('should create a error response object with status, message, and stacktrace but only return status and message when toJsonApiResponse() is called', () => {
    const response = new responseClass.ErrorResponse(statusType.ERROR, 'This is an error message', 'stack trace would go here');
    expect(response.toJsonApiResponse()).to.deep.equal({ status: 'error', message: 'This is an error message' });
  });

  it('should create a sql error response object with status, message, and stacktrace', () => {
    const error = {
      code: '23404',
      error: 'This is a sql error message',
      stack: 'This is the stacktrace returned from sql',
    };
    const response = new responseClass.SQLErrorResponse(error);
    expect(response).to.deep.equal({ status: 'error', message: `SQL Exception (${error.code}): ${error.message}`, stacktrace: 'This is the stacktrace returned from sql' });
  });

  it('should create a sql error response object with status, message, and stacktrace but only return status and message when toJsonApiResponse() is called', () => {
    const error = {
      code: '23404',
      error: 'This is a sql error message',
      stack: 'This is the stacktrace returned from sql',
    };
    const response = new responseClass.SQLErrorResponse(error);
    expect(response.toJsonApiResponse()).to.deep.equal({ status: 'error', message: `SQL Exception (${error.code}): ${error.message}` });
  });
});
