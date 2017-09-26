var request  = require('request');

//Web Service Requests
var webServiceCall = function(options, handleResponse, handleError, req, res, next) {
    request(options, function (err, response, body) {
        if (!err && response.statusCode > 199 && response.statusCode < 300) {
            if(body === ""){}
            handleResponse(body, req, res, next);
        } else if (handleError) {
            handleError(body, req, res, next);
        } else {
            console.log('ERROR during webservice call: ' + body);
        }
    });
};

var errorHandler = function(e, req, res, next) {
    res.status(500).send(e);
};


module.exports = {
    webServiceCall: webServiceCall,
    errorHandler: errorHandler
};