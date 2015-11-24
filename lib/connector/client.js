'use strict';

const AbstractConnector = require('./abstract');

class ClientConnector extends AbstractConnector {
  connect(options) {
    this.createConnection().connect(options);
    return this;
  }

  disconnect() {
    this.connectionPool.close();
    return this;
  }
}

module.exports = ClientConnector;
