'use strict';

class AbstractFilter {
  constructor() {
    this.connector = null;
  }

  setConnector(connector) {
    this.connector = connector;
  }

  filterConnect() {
    throw new Error('not_implemented');
  }
}

module.exports = AbstractFilter;
