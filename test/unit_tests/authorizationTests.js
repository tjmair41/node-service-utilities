var expect = require('chai').expect;
var supertest = require('supertest');
var authorization = require('../../authorization.js');

describe('The authorization module', function() {
    it('returns the path with the leading / removed if no resource ID is found', function(done) {
        var path = "/clients/sites/carriers";
        var endpoint = "carriers";

        var newPath = authorization.prepEndpointForACS(path, endpoint);
        expect(newPath).to.equal(path.slice(1));
        done();
    });

    it('returns the path with the leading / removed and /default appended to the end if a resource ID is found', function(done) {
        var path = "/clients/sites/carriers/1";
        var endpoint = "carriers";

        var newPath = authorization.prepEndpointForACS(path, endpoint);
        expect(newPath).to.equal(path.slice(1) + "/default");
        done();
    });

    it('returns the path if path is null or empty or endpoint is null or empty', function(done) {
        var path = "/clients/sites/carriers";
        var endpoint = "carriers";

        var newPath = authorization.prepEndpointForACS(null, endpoint);
        expect(newPath).to.be.null;
        newPath = authorization.prepEndpointForACS("", endpoint);
        expect(newPath).to.be.empty;
        newPath = authorization.prepEndpointForACS(path, null);
        expect(newPath).to.equal(path);
        newPath = authorization.prepEndpointForACS(path, "");
        expect(newPath).to.equal(path);

        done();
    });
})