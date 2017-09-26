const snakeCase = require('snake-case');
const responseClass = require('./response.js');

const statusType = responseClass.statusType;

/*
  Adding a new method 'toSnakeCase' to an array.
  The method will take an array that is camelCase and convert it to snakeCase

  input => ['fieldName', 'anotherFieldName']
  output => ['field_name', 'another_field_name']
 */
if (!Array.prototype.toSnakeCase) {
  Array.prototype.toSnakeCase = function () { // eslint-disable-line no-extend-native, func-names
    for (let i = 0; i < this.length; i += 1) {
      this[i] = snakeCase(this[i]);
    }
    return this;
  };
}

function objectToFields(o) {
  let fields = '';
  const keys = Object.keys(o);
  for (let i = 0; i < keys.length; i += 1) {
    fields += `${keys[i]},`;
  }
  return fields.slice(0, -1); // remove the trailing comma
}


/*
 Adding a new method 'removeNegativeSigns' to an array.
 The method will take an array that is camelCase with fields 
 prefixed with a negative sign and remove the negative signs.

 input => ['fieldName','-anotherFieldName']
 output => ['fieldName','anotherFieldName']
*/
if (!Array.prototype.removeNegativeSigns) {
  Array.prototype.removeNegativeSigns = function () { // eslint-disable-line no-extend-native, func-names, max-len
    for (let i = 0; i < this.length; i += 1) {
      if (this[i].charAt(0) === '-') {
        this[i] = this[i].slice(1);
      }
    }
    return this;
  };
}

/*
  fieldValidator function will take two paramters 'fieldsToValidate' and 'validItems'
    fieldsToValidate should be a string of comma seperated values and validItems should be
    an array of strings to validate against. If there are no errors fieldValidator will return 
    a snakeCase array of the validatedFields

  fieldsToValidate => 'siteId,clientId'
  validItems => ['siteId', 'clientId']

  Returns => ['site_id','client_id']
 */
function fieldValidator(fieldsToValidate, validItems) {
  const validatedItems = [];
  if (fieldsToValidate == null || fieldsToValidate.length === 0) {
    return new responseClass.Response(statusType.INVALID, 'No fields to validate');
  } else if (validItems == null || validItems.length === 0) {
    return new responseClass.Response(statusType.INVALID, 'validItems cannot be null, fieldValidator needs fields to validate against');
  }
  const fieldsToValidateArray = fieldsToValidate.split(',');
  fieldsToValidateArray.removeNegativeSigns();
  for (let i = 0; i < fieldsToValidateArray.length; i += 1) {
    if (validItems.indexOf(fieldsToValidateArray[i]) > -1) {
      validatedItems.push(fieldsToValidateArray[i]);
    } else {
      return new responseClass.Response(statusType.INVALID, `Invalid Field: ${fieldsToValidateArray[i]}`);
    }
  }
  return new responseClass.Response(statusType.VALID, validatedItems.toSnakeCase());
}

/*
  sortSqlGenerator function will take two parameters 'sortParameters' and 'validItems'
    sortParameters should be a string of comma seperated values and validItems should 
    be an array of strings to validate against. If there are no errors sortSqlGenerator 
    will return a string of SQL to place in your query for sorting. sortSqlGenerator will 
    also use fieldValidator as a helper function to validate that the sortParamters you 
    pass in are valid fields to sort on.

    sortParameters => 'siteId,-clientId'
    validItems => ['siteId', 'clientId']

    Return => 'site_id ASC, client_id DESC'
 */
function sortSqlGenerator(sortParameters, validItems) {
  let sortSql = '';
  if (sortParameters == null || sortParameters.length === 0) {
    return new responseClass.Response(statusType.INVALID, 'No sort parameters to validate');    
  } else if (validItems == null || validItems.length === 0) {
    return new responseClass.Response(statusType.INVALID, 'validItems cannot be null, fieldValidator needs fields to validate against');    
  }
  const fieldsToValidateArray = sortParameters.split(',');
  const fieldsToValidateWithoutNegative = sortParameters.split(',');
  fieldsToValidateWithoutNegative.removeNegativeSigns();
  for (let i = 0; i < fieldsToValidateWithoutNegative.length; i += 1) {
    if (validItems.indexOf(fieldsToValidateWithoutNegative[i]) > -1) {
      if (fieldsToValidateArray[i].charAt(0) === '-') {
        sortSql += snakeCase(fieldsToValidateArray[i].slice(1)).concat(' DESC, ');
      } else {
        sortSql += snakeCase(fieldsToValidateArray[i]).concat(' ASC, ');
      }
    } else {
      return new responseClass.Response(statusType.INVALID, `Invalid sort field: ${fieldsToValidateArray[i]}`);      
    }
  }
  return new responseClass.Response(statusType.VALID, sortSql.slice(0, -2));
}

module.exports = {
  fieldValidator,
  sortSqlGenerator,
  objectToFields,
};
