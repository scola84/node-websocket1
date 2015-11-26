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
      // throw error
      this.last = this.loadBalancer.send(message);
    }

    return this;
  }

  handleMessage(event) {
    if (this.last) {
      event.connection = this.last;
      this.last = null;

      super.handleMessage(event);
    }
  }
}

module.exports = ReqSocket;
