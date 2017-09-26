const expect = require('chai').expect;
const timeSeries = require('../../time_series.js');

describe('Timeseries request builder', () => {
  it('returns JSON timeseries ingestion request if valid', (done) => {
    const tag1 = new timeSeries.IngestionTag('Carrier-X');
    tag1.addDataPoint(12315, 12, 1);
    tag1.addDataPoint(12316, 13, 1);
    tag1.addAttribute('siteId', 'HVL');

    const tag2 = new timeSeries.IngestionTag('Carrier-Y');
    tag2.addDataPoint(12315, 23, 1);
    tag2.addDataPoint(12316, 24, 1);
    tag2.addAttribute('siteId', 'HVL');

    const request = new timeSeries.IngestionRequest('12345fKLejf');
    request.addTag(tag1);
    request.addTag(tag2);
    expect(JSON.stringify(request)).to.equal('{"messageId":"12345fKLejf","body":[{"name":"Carrier-X","datapoints":[[12315,12,1],[12316,13,1]],"attributes":{"siteId":"HVL"}},{"name":"Carrier-Y","datapoints":[[12315,23,1],[12316,24,1]],"attributes":{"siteId":"HVL"}}]}');
    done();
  });
});

describe('buildTimeSeriesIngestionRequest function', () => {
  it('returns JSON timeseries ingestion request', (done) => {
    const location = {
      clientId: 'client1',
      siteId: 'site1',
      carrierId: 'carrier1',
      x: 81.4567,
      y: 17.777777,
      timestamp: 1467834280005,
    };

    const VALID_TAGS = new Map([
      ['Carrier-X', 'x'],
      ['Carrier-Y', 'y'],
    ]);

    const attributes = ['clientId', 'siteId', 'carrierId'];

    const request = timeSeries.buildTimeSeriesIngestionRequest(location, VALID_TAGS, attributes);
    expect(JSON.stringify(request)).to.equal('{"messageId":"14678342800051328841321","body":[{"name":"Carrier-X","datapoints":[[1467834280005,81.4567,3]],"attributes":{"clientId":"client1","siteId":"site1","carrierId":"carrier1"}},{"name":"Carrier-Y","datapoints":[[1467834280005,17.777777,3]],"attributes":{"clientId":"client1","siteId":"site1","carrierId":"carrier1"}}]}');
    done();
  });
});

