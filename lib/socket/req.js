'use strict';

const AbstractSocket = require('./abstract');

class ReqSocket extends AbstractSocket {
  constructor(config, loadBalancer) {
    super(config);

    this.loadBalancer = loadBalancer;
    this.last = null;
  }

  send(message) {
    if (this.last) {
      throw new Error('waiting');
    }

    this.last = this.loadBalancer.getConnection();
    this.last.send(message);

    return this;
  }
}

module.exports = ReqSocket;
