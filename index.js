const webhelper = require('./webhelper.js');
const authorization = require('./authorization.js');
const validation = require('./validation.js');
const postClass = require('./post_body.js');
const patchClass = require('./patch_body.js');
const responseClass = require('./response.js');
const timeSeries = require('./time_series');


module.exports = {
  webhelper,
  authorization,
  validation,
  postClass,
  patchClass,
  responseClass,
  timeSeries,
};
