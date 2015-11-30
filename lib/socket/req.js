'use strict';

const AbstractSocket = require('./abstract');

class ReqSocket extends AbstractSocket {
  constructor(config, loadBalancer) {
    super(config);

    this.loadBalancer = loadBalancer;
    this.last = null;
  }

  send(message) {
    if (!this.last) {
      this.last = this.loadBalancer.send(message);
    }

    return this;
  }

  handleMessage(event) {
    if (!this.last) {
      return;
    }

    event.connection = this.last;
    this.last = null;

    this.emit('message', event);
  }
}

module.exports = ReqSocket;
