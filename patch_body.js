const validation = require('./validation.js');
const snakeCase = require('snake-case');
const responseClass = require('./response.js');

const statusType = responseClass.statusType;

class PatchBody {
  constructor(body, mutableFields) {
    this.body = body;
    this.mutableFields = mutableFields;
  }

  /* 
  This function validates a PATCH body for correct command keywords,
  valid field names, and no nonUpdatableFields, which are fields
  that shouldn't be updated like primary keys.  Returns an error message
  if any issues arise, otherwise it returns null for a valid 
  PATCH body.

  body => The JSON object array of the PATCH body 
    (ex. [{ op: 'replace', path: 'field1', value: 22 }])
  mutableFields => An array of fields that are allowed to be updated (ex. ['field1', 'field2'])
  */
  validate() {
    if (!this.body.length) {
      return new responseClass.Response(statusType.INVALID, 'Request body must be an array of JSON objects.');
    }

    let fields = '';
    for (let i = 0; i < this.body.length; i += 1) {
      if (this.body[i].op == null || this.body[i].path == null || this.body[i].value == null) {
        return new responseClass.Response(statusType.INVALID, 'Request body must contain keys: op, path and value');
      } else if (this.body[i].op != null && this.body[i].op !== 'replace') {
        return new responseClass.Response(statusType.INVALID, `${this.body[i].op} operation is not currently supported`);
      }
      fields += `${this.body[i].path},`;
    }
    fields = fields.slice(0, -1); // remove the trailing comma

    return validation.fieldValidator(fields, this.mutableFields);
  }

  toSqlUpdate() {
    let sql = '';
    for (let i = 0; i < this.body.length; i += 1) {
      const column = snakeCase(this.body[i].path);
      if (typeof this.body[i].value === 'string') {
        sql += `${column} = '${this.body[i].value}', `;
      } else {
        sql += `${column} = ${this.body[i].value}, `;
      }
    }
    return sql.slice(0, -2);
  }
}

exports.PatchBody = PatchBody;
