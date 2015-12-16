'use strict';

const EventHandler = require('@scola/events');

class AbstractConnector extends EventHandler {
  constructor(connectionPool, connectionProvider) {
    super();

    this.connectionPool = connectionPool;
    this.connectionProvider = connectionProvider;
  }

  open() {
    this.addPoolHandlers();
    return this;
  }

  close(code, reason) {
    this.connectionPool.close(code, reason);
    this.removePoolHandlers();

    return this;
  }

  createMessage() {
    return this.connectionPool.createMessage();
  }

  addPoolHandlers() {
    this.proxyListener('close', this.connectionPool);
    this.proxyListener('error', this.connectionPool);
    this.proxyListener('message', this.connectionPool);
    this.proxyListener('open', this.connectionPool);
    this.proxyListener('send', this.connectionPool);
  }

  removePoolHandlers() {
    this.unproxyListener('close', this.connectionPool);
    this.unproxyListener('error', this.connectionPool);
    this.unproxyListener('message', this.connectionPool);
    this.unproxyListener('open', this.connectionPool);
    this.unproxyListener('send', this.connectionPool);
  }
}

module.exports = AbstractConnector;
