'use strict';

const EventHandler = require('scola-events');

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
    return this;
  }

  addConnectorHandlers() {
    this.bindListener('message', this.connector, this.handleMessage);
  }

  removeConnectorHandlers() {
    this.unbindListener('message', this.connector);
  }

  handleMessage(event) {
    this.emit('message', event);
  }

  send() {
    throw new Error('not_implemented');
  }
}

module.exports = AbstractSocket;
