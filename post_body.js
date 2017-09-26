const validation = require('./validation.js');
const validator = require('validator');
const responseClass = require('./response.js');

const statusType = responseClass.statusType;

class PostBody {
  constructor(body, requiredFields, validFields) {
    this.body = body;
    this.requiredFields = requiredFields;
    this.validFields = validFields;
  }

  /*
  This function will validate the contents of a POST
  body, and return an error message if any problems
  arise.  If the POST body is valid, it will return 
  null.

  body => The JSON object of the POST request (ex. { field1: 'field1' })
  requiredFields => list of required fields that the body must contain
  (ex. ['field1', 'field2'])
  validFields => list of fields that are allowed to be set in the database 
    (ex. ['field1', 'field2'])
*/
  validate() {
    if (Object.keys(this.body).length === 0) {
      return new responseClass.Response(statusType.INVALID, 'Request body cannot be empty');
    }

    if (this.requiredFields !== null) {
      for (let i = 0; i < this.requiredFields.length; i += 1) {
        const field = this.body[this.requiredFields[i]];
        if ((typeof field === 'undefined') || validator.isEmpty(field.toString())) {
          return new responseClass.Response(statusType.INVALID, `${this.requiredFields[i]} cannot be empty`);
        }
      }
    }

    return validation.fieldValidator(validation.objectToFields(this.body), this.validFields);
  }
}

exports.PostBody = PostBody;
