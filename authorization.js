const request = require('request');
const validator = require('validator');
const responseClass = require('./response');
const statusType = require('./response.js').statusType;

function authorize(req, endpoint, authorizationUri, callback) {
  request.post({
    url: authorizationUri,
    headers: {
      'Content-Type': 'application/json',
      accessToken: req.header('Authorization').slice(7),
    },
    body: JSON.stringify({
      acsUri: endpoint,
      httpVerb: req.method,
    }),
  }, (error, res, body) => {
    if (error != null) {
      callback(new responseClass.ErrorResponse(statusType.ERROR, 'An unknown error occured', error));
    } else if ((typeof res === 'undefined')) {
      callback(new responseClass.Response(statusType.ERROR, 'Timed out when making request to Authorization'));
    } else if (res.statusCode === 404) {
      callback(new responseClass.Response(statusType.ERROR, 'Authorization URL not found.'));
    } else if (res.statusCode === 500) {
      callback(new responseClass.Response(statusType.ERROR, 'Unkown authorization error'));
    } else {
      callback(new responseClass.Response(statusType.SUCCESS, JSON.parse(body)));      
    }
  });
}

// Preps the URL endpoint that will be sent to ACS by appending /default
// to endpoints that end with a resource identifier.
//
// path => the URL endpoint (ex. /clients/sites/carriers)
// endpoint => the deepest endpoint in the URL (ex. carriers)
function prepEndpointForACS(path, endpoint) {
  if (path == null || validator.isEmpty(path) || endpoint == null || validator.isEmpty(endpoint)) {
    return path;
  } else if (path.substring(path.length - endpoint.length) === endpoint) {
    return path.slice(1);
  }
  return `${path.slice(1)}/default`;
}

module.exports = {
  authorize,
  prepEndpointForACS,
};
