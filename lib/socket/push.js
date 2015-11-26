'use strict';

const AbstractSocket = require('./abstract');

class PushSocket extends AbstractSocket {
  constructor(config, loadBalancer) {
    super(config);
    this.loadBalancer = loadBalancer;
  }

  send(message) {
    this.loadBalancer.send(message);
    return this;
  }

  handleMessage() {}
}

module.exports = PushSocket;
