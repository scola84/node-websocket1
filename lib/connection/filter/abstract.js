'use strict';

class AbstractFilter {
  constructor() {
    this.connection = null;
  }

  setConnection(connection) {
    this.connection = connection;
  }

  filterReceive() {
    throw new Error('not_implemented');
  }

  filterSend() {
    throw new Error('not_implemented');
  }
}

module.exports = AbstractFilter;
