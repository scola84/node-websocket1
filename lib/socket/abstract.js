'use strict';

const EventHandler = require('@scola/events');

class AbstractSocket extends EventHandler {
  constructor(config) {
    super();

    this.config = config;
    this.connector = null;
  }

  open(connector) {
    this.connector = connector;
    this.addConnectorHandlers();

    return this;
  }

  close() {
    this.removeConnectorHandlers();
    this.connector = null;

    return this;
  }

  addConnectorHandlers() {
    this.bindListener('message', this.connector, this.handleMessage);
    this.proxyListener('close', this.connector);
    this.proxyListener('error', this.connector);
    this.proxyListener('open', this.connector);
    this.proxyListener('send', this.connector);
  }

  removeConnectorHandlers() {
    this.unbindListener('message', this.connector);
    this.unproxyListener('close', this.connector);
    this.unproxyListener('error', this.connector);
    this.unproxyListener('open', this.connector);
    this.unproxyListener('send', this.connector);
  }

  send() {
    throw new Error('not_implemented');
  }

  handleMessage() {
    throw new Error('not_implemented');
  }
}

module.exports = AbstractSocket;
