const request = require('request');
const validator = require('validator');

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
      callback(error);
    }

    callback(JSON.parse(body));
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
