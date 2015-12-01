'use strict';

const AbstractConnector = require('./abstract');

class ClientConnector extends AbstractConnector {
  connect(options) {
    this.connectionProvider.get().connect(options);
    return this;
  }
}

module.exports = ClientConnector;
