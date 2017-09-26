const QUALITY_BAD = 0;
const QUALITY_UNCERTAIN = 1;
const QUALITY_NOT_APPLICABLE = 2;
const QUALITY_GOOD = 3;

class IngestionRequest {
  constructor(messageId) {
    this.messageId = messageId;
    this.body = [];
  }

  addTag(tag) {
    this.body.push(tag);
  }

  addTags(tags) {
    tags.forEach((tag) => {
      this.body.push(tag);
    });
  }
}

class IngestionTag {
  constructor(name) {
    this.name = name;
    this.datapoints = [];
    this.attributes = {};
  }

  addDataPoint(epochInMs, measure, quality) {
    const datapoint = [epochInMs, measure, quality];
    this.datapoints.push(datapoint);
  }

  addAttribute(key, value) {
    this.attributes[key] = value;
  }

  addAttributes(keyValues) {
    keyValues.forEach((keyValue) => {
      this.addAttribute(keyValue[0], keyValue[1]);
    });
  }
}

class QueryRequest {
  constructor(start, end, tags) {
    this.start = start;
    this.end = end;
    this.tags = tags;
  }

  addTag(tag) {
    this.tags.push(tag);
  }

  addTags(tags) {
    tags.forEach((tag) => {
      this.tags.push(tag);
    });
  }
}

class QueryTag {
  constructor(name, limit, order, suppressGroupByType, aggregations, filters, groups) {
    this.name = name;
    this.limit = limit;
    this.order = order;
    this.suppressGroupByType = suppressGroupByType;
    this.aggregations = aggregations;
    this.filters = filters;
    this.groups = groups;
  }

  addAggregation(aggregation) {
    this.aggregations.push(aggregation);
  }

  addAggregations(aggregations) {
    aggregations.forEach((aggregation) => {
      this.aggregations.push(aggregation);
    });
  }

  addFilter(filter) {
    this.filters.push(filter);
  }

  addFilters(filters) {
    filters.forEach((filter) => {
      this.filters.push(filter);
    });
  }

  addGroup(group) {
    this.groups.push(group);
  }

  addGroups(groups) {
    groups.forEach((group) => {
      this.groups.push(group);
    });
  }
}

function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i += 1) {
    hash += Math.pow((str.charCodeAt(i) * 31), (str.length - i));
    hash &= hash; // Convert to 32bit integer
  }
  return hash;
}

function buildTimeSeriesIngestionRequest(payload, mTags, attributes) {
  const request = new IngestionRequest(`${payload.timestamp}${Math.abs(hashString(payload.carrierId))}`);
  mTags.forEach((value, key) => {
    if (typeof payload[value] !== 'undefined') {
      const tag = new IngestionTag(key);
      tag.addDataPoint(payload.timestamp, payload[value], QUALITY_GOOD);
      attributes.forEach((attribute) => {
        if (typeof payload[attribute] !== 'undefined') {
          tag.addAttribute(attribute, payload[attribute]);
        }
      });
      request.addTag(tag);
    }
  });
  return request;
}

exports.buildTimeSeriesIngestionRequest = buildTimeSeriesIngestionRequest;
exports.IngestionRequest = IngestionRequest;
exports.IngestionTag = IngestionTag;
exports.QueryRequest = QueryRequest;
exports.QueryTag = QueryTag;
exports.QUALITY_BAD = QUALITY_BAD;
exports.QUALITY_GOOD = QUALITY_GOOD;
exports.QUALITY_NOT_APPLICABLE = QUALITY_NOT_APPLICABLE;
exports.QUALITY_UNCERTAIN = QUALITY_UNCERTAIN;

