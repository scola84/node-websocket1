'use strict';

const AbstractSocket = require('./abstract');

class ReqSocket extends AbstractSocket {
  constructor(config, loadBalancer) {
    super(config);
    this.loadBalancer = loadBalancer;
  }

  send(message) {
    this.loadBalancer.send(message);
    return this;
  }

  handleMessage(event) {
    this.emit('message', event);
  }
}

module.exports = ReqSocket;
