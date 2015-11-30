'use strict';

const AbstractSocket = require('./abstract');

class PullSocket extends AbstractSocket {
  send() {}

  handleMessage(event) {
    this.emit('message', event);
  }
}

module.exports = PullSocket;
