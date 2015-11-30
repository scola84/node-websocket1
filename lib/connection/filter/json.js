'use strict';

const AbstractFilter = require('./abstract');

class JsonFilter extends AbstractFilter {
  receive(message) {
    message.setBody(JSON.parse(message.getBody()));
  }

  send(message) {
    message.setBody(JSON.stringify(message.getBody()));
  }
}

module.exports = JsonFilter;
