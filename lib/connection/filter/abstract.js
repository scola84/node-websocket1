'use strict';

class AbstractFilter {
  constructor() {
    this.connection = null;
  }

  setConnection(connection) {
    this.connection = connection;
    return this;
  }

  receive() {
    throw new Error('not_implemented');
  }

  send() {
    throw new Error('not_implemented');
  }
}

module.exports = AbstractFilter;
