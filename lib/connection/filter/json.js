'use strict';

const AbstractFilter = require('./abstract');

class JsonFilter extends AbstractFilter {
  filterReceive(message) {
    message.setBody(JSON.parse(message.getBody()));
  }

  filterSend(message) {
    message.setBody(JSON.stringify(message.getBody()));
  }
}

module.exports = JsonFilter;
