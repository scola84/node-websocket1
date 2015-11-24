'use strict';

const AbstractSocket = require('./abstract');

class RepSocket extends AbstractSocket {
  constructor() {
    super();
    this.last = null;
  }

  send(message) {
    if (!this.last) {
      throw new Error('waiting');
    }

    this.last.send(message);
    this.last = null;

    return this;
  }

  handleMessage(event) {
    this.last = event.connection;
    super.handleMessage(event);
  }
}

module.exports = RepSocket;
