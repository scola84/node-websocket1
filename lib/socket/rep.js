'use strict';

const AbstractSocket = require('./abstract');

class RepSocket extends AbstractSocket {
  constructor() {
    super();
    this.last = null;
  }

  send(message) {
    if (this.last && this.last.canSend()) {
      this.last.send(message);
      this.last = null;
    }

    return this;
  }

  handleMessage(event) {
    this.last = event.connection;
    this.emit('message', event);
  }
}

module.exports = RepSocket;
