'use strict';

const AbstractSocket = require('./abstract');

class DealerSocket extends AbstractSocket {
  constructor(config, loadBalancer) {
    super(config);
    this.loadBalancer = loadBalancer;
  }

  send(message) {
    this.loadBalancer.getConnection().send(message);
    return this;
  }
}

module.exports = DealerSocket;
