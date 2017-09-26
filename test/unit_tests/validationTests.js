const expect = require('chai').expect;
const sinon = require('sinon');
const validation = require('../../validation.js');
const postClass = require('../../post_body.js');
const patchClass = require('../../patch_body.js');
const responseClass = require('../../response.js');

const statusType = responseClass.statusType;

let fieldValidatorStub;

describe('The PostBody validate function', () => {
  before((done) => {
    fieldValidatorStub = sinon.stub(validation, 'fieldValidator');
    done();
  });

  afterEach((done) => {
    fieldValidatorStub.reset();
    done();
  });

  after((done) => {
    fieldValidatorStub.restore();
    done();
  });

  it('returns \'success\' response with data if valid POST body', (done) => {
    const body = {
      field1: 'field1',
      field2: 12,
      field3: 'field3',
    };
    const requiredFields = ['field1', 'field2'];
    const validFields = ['field1', 'field2', 'field3'];
    const postBody = new postClass.PostBody(body, requiredFields, validFields);
    const expectedResponse = new responseClass.Response(statusType.VALID, ['field1', 'field2']);
    fieldValidatorStub.returns(expectedResponse);
    const validationResponse = postBody.validate();
    expect(validationResponse).to.deep.equal(expectedResponse);
    done();
  });

  it('returns \'success\' response with data if requiredFields is null and all fields are valid', (done) => {
    const body = {
      field1: 'field1',
      field2: 'field2',
    };
    const requiredFields = null;
    const validFields = ['field1', 'field2', 'field3'];
    const postBody = new postClass.PostBody(body, requiredFields, validFields);
    const expectedResponse = new responseClass.Response(statusType.VALID, ['field1', 'field2']);
    fieldValidatorStub.returns(expectedResponse);
    const validationResponse = postBody.validate();
    expect(validationResponse).to.deep.equal(expectedResponse);
    done();
  });

  it('returns \'invalid\' response if POST body is empty', (done) => {
    const body = {};
    const requiredFields = ['field3'];
    const validFields = ['field1', 'field2', 'field3'];
    const postBody = new postClass.PostBody(body, requiredFields, validFields);
    const expectedResponse = new responseClass.Response(statusType.INVALID, 'Request body cannot be empty');
    const validationResponse = postBody.validate();
    expect(validationResponse).to.deep.equal(expectedResponse);
    done();
  });

  it('returns \'invalid\' response if POST body missing required fields', (done) => {
    const body = {
      field1: 'field1',
      field2: 'field2',
    };
    const requiredFields = ['field3'];
    const validFields = ['field1', 'field2', 'field3'];
    const postBody = new postClass.PostBody(body, requiredFields, validFields);
    const expectedResponse = new responseClass.Response(statusType.INVALID, 'field3 cannot be empty');    
    const validationResponse = postBody.validate();
    expect(validationResponse).to.deep.equal(expectedResponse);
    done();
  });

  it('returns \'invalid\' response if POST body contains invalid fields', (done) => {
    const body = {
      field1: 'field1',
      field2: 12,
      field3: 'field3',
      invalidField: 10.1,
    };
    const requiredFields = ['field1', 'field2'];
    const validFields = ['field1', 'field2', 'field3'];
    const postBody = new postClass.PostBody(body, requiredFields, validFields);
    const expectedResponse = new responseClass.Response(statusType.INVALID, 'Invalid Field: invalidField');
    fieldValidatorStub.returns(expectedResponse);
    const validationResponse = postBody.validate();
    expect(validationResponse).to.deep.equal(expectedResponse);
    done();
  });
});

describe('The validatePatchBody function', () => {
  before((done) => {
    fieldValidatorStub = sinon.stub(validation, 'fieldValidator');
    done();
  });

  afterEach((done) => {
    fieldValidatorStub.reset();
    done();
  });

  after((done) => {
    fieldValidatorStub.restore();
    done();
  });

  it('returns \'success\' response with data if valid PATCH body', (done) => {
    const body = [
      { op: 'replace', path: 'field1', value: 'value1' },
      { op: 'replace', path: 'field2', value: 'value2' },
    ];
    const mutableFields = ['field1', 'field2'];
    const patchBody = new patchClass.PatchBody(body, mutableFields);
    const expectedResponse = new responseClass.Response(statusType.INVALID, ['field1', 'field2']);
    fieldValidatorStub.returns(expectedResponse);
    const validationResponse = patchBody.validate();
    expect(validationResponse).to.deep.equal(expectedResponse);
    done();
  });

  it('returns \'invalid\' response if PATCH body isn\'t an array', (done) => {
    const body = { op: 'replace', path: 'field1', value: 'value1' };
    const mutableFields = ['field1', 'field2'];
    const patchBody = new patchClass.PatchBody(body, mutableFields);
    const expectedResponse = new responseClass.Response(statusType.INVALID, 'Request body must be an array of JSON objects.');
    const validationResponse = patchBody.validate();
    expect(validationResponse).to.deep.equal(expectedResponse);
    done();
  });

  // Not really doing anything
  it('returns \'invalid\' response if mutable fields is null or empty', (done) => {
    const body = [
      { op: 'replace', path: 'field1', value: 'value1' },
      { op: 'replace', path: 'field2', value: 'value2' },
    ];
    const mutableFields = [];
    let patchBody = new patchClass.PatchBody(body, mutableFields);
    const expectedResponse = new responseClass.Response(statusType.INVALID, 'validItems cannot be null, fieldValidator needs fields to validate against');
    fieldValidatorStub.returns(expectedResponse);
    let validationResponse = patchBody.validate();
    expect(validationResponse).to.deep.equal(expectedResponse);
    fieldValidatorStub.reset();
    patchBody = new patchClass.PatchBody(body, null);
    fieldValidatorStub.returns(expectedResponse);
    validationResponse = patchBody.validate();
    expect(validationResponse).to.deep.equal(expectedResponse);
    done();
  });

  // Not really doing anything
  it('returns \'invalid\' response if PATCH body trying to update immutable fields', (done) => {
    const body = [
      { op: 'replace', path: 'field1', value: 'value1' },
      { op: 'replace', path: 'field2', value: 'value2' },
    ];
    const mutableFields = ['field1'];
    const patchBody = new patchClass.PatchBody(body, mutableFields);
    const expectedResponse = new responseClass.Response(statusType.INVALID, 'Invalid Field: field2');
    fieldValidatorStub.returns(expectedResponse);
    const validationResponse = patchBody.validate();
    expect(validationResponse).to.deep.equal(expectedResponse);
    done();
  });

  it('returns \'invalid\' response message if PATCH body is empty', (done) => {
    const body = [];
    const mutableFields = ['field3'];
    const patchBody = new patchClass.PatchBody(body, mutableFields);
    const expectedResponse = new responseClass.Response(statusType.INVALID, 'Request body must be an array of JSON objects.');
    const validationResponse = patchBody.validate();
    expect(validationResponse).to.deep.equal(expectedResponse);
    done();
  });

  it('returns valid update sql code', (done) => {
    const body = [
      { op: 'replace', path: 'uri', value: 'www.test.com' },
      { op: 'replace', path: 'offsetY', value: 22 },
    ];
    const mutableFields = ['field1', 'field2'];
    const patchBody = new patchClass.PatchBody(body, mutableFields);
    const updateSql = patchBody.toSqlUpdate();
    expect(updateSql).to.equal('uri = \'www.test.com\', offset_y = 22');
    done();
  });
});

describe('The fieldValidator function', () => {
  it('returns \'invalid\' response when you pass in empty string to validate', (done) => {
    const fieldsToValidate = '';
    const validItems = ['clientId'];
    const expectedResponse = new responseClass.Response(statusType.INVALID, 'No fields to validate');
    const emptyFieldsResponse = validation.fieldValidator(fieldsToValidate, validItems);
    expect(emptyFieldsResponse).to.deep.equal(expectedResponse);
    const nullFieldsResponse = validation.fieldValidator(null, validItems);
    expect(nullFieldsResponse).to.deep.equal(expectedResponse);
    done();
  });

  it('returns \'invalid\' response when you pass in an empty array to validate against', (done) => {
    const fieldsToValidate = 'clientId';
    const validItems = [];
    const expectedResponse = new responseClass.Response(statusType.INVALID, 'validItems cannot be null, fieldValidator needs fields to validate against');
    const emptyFieldsResponse = validation.fieldValidator(fieldsToValidate, validItems);
    expect(emptyFieldsResponse).to.deep.equal(expectedResponse);
    const nullFieldsResponse = validation.fieldValidator(fieldsToValidate, null);
    expect(nullFieldsResponse).to.deep.equal(expectedResponse);
    done();
  });

  it('returns \'invalid\' response when you pass in an invalid field', (done) => {
    const fieldsToValidate = 'invalidField';
    const validItems = ['siteId', 'clientId'];
    const expectedResponse = new responseClass.Response(statusType.INVALID, 'Invalid Field: invalidField');
    const response = validation.fieldValidator(fieldsToValidate, validItems);
    expect(response).to.deep.equal(expectedResponse);
    done();
  });

  it('returns \'success\' response with snakeCase array of validated fields', (done) => {
    const fieldsToValidate = 'siteId,clientId';
    const validItems = ['siteId', 'clientId'];
    const expectedResponse = new responseClass.Response(statusType.VALID, ['site_id', 'client_id']);
    const response = validation.fieldValidator(fieldsToValidate, validItems);
    expect(response).to.deep.equal(expectedResponse);
    done();
  });

  it('returns \'success\' response with snakeCase array of validated fields with fieldsToValidate having negative sign', (done) => {
    const fieldsToValidate = 'siteId,-clientId';
    const validItems = ['siteId', 'clientId'];
    const expectedResponse = new responseClass.Response(statusType.VALID, ['site_id', 'client_id']);
    const response = validation.fieldValidator(fieldsToValidate, validItems);
    expect(response).to.deep.equal(expectedResponse);
    done();
  });
});

describe('The sortSqlGenerator function', () => {
  it('returns \'invalid\' response when you pass in empty sort parameters to validate', (done) => {
    const sortParamsToValidate = '';
    const validItems = [];
    const emptyFieldsResponse = validation.sortSqlGenerator(sortParamsToValidate, validItems);
    const expectedResponse = new responseClass.Response(statusType.INVALID, 'No sort parameters to validate');
    expect(emptyFieldsResponse).to.deep.equal(expectedResponse);
    const nullFieldsResponse = validation.sortSqlGenerator(null, validItems);
    expect(nullFieldsResponse).to.deep.equal(expectedResponse);
    done();
  });

  it('returns \'invalid\' response when you pass in an empty array to validate against', (done) => {
    const sortParamsToValidate = 'clientId';
    const validItems = [];
    const emptyFieldsResponse = validation.sortSqlGenerator(sortParamsToValidate, validItems);
    const expectedResponse = new responseClass.Response(statusType.INVALID, 'validItems cannot be null, fieldValidator needs fields to validate against');
    expect(emptyFieldsResponse).to.deep.equal(expectedResponse);
    const nullFieldsResponse = validation.sortSqlGenerator(sortParamsToValidate, null);
    expect(nullFieldsResponse).to.deep.equal(expectedResponse);
    done();
  });

  it('returns \'invalid\' response when you pass in an invalid field', (done) => {
    const sortParamsToValidate = 'invalidField';
    const validItems = ['siteId', 'clientId'];
    const expectedResponse = new responseClass.Response(statusType.INVALID, 'Invalid sort field: invalidField');    
    const response = validation.sortSqlGenerator(sortParamsToValidate, validItems);
    expect(response).to.deep.equal(expectedResponse);
    done();
  });

  it('returns \'success\' response with sort SQL when passed valid fields', (done) => {
    const sortParamsToValidate = 'siteId,-clientId';
    const validItems = ['siteId', 'clientId'];
    const expectedResponse = new responseClass.Response(statusType.VALID, 'site_id ASC, client_id DESC');
    const response = validation.sortSqlGenerator(sortParamsToValidate, validItems);
    expect(response).to.deep.equal(expectedResponse);
    done();
  });
});
