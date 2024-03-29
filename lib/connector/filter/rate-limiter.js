'use strict';

const AbstractFilter = require('./abstract');

class RateLimiter extends AbstractFilter {
  constructor(config) {
    super();

    this.config = config;
    this.rates = new Map();
  }

  connect(info) {
    return new Promise(this.handleConnect.bind(this, info));
  }

  handleConnect(info, resolve, reject) {
    try {
      const key = this.getKey(info);

      if (!this.rates.has(key)) {
        this.rates.set(key, {});
      }

      const rate = this.rates.get(key);
      const refTime = Date.now() - this.config.get('socket.rateLimit.interval');
      const lastTime = rate.timestamp || refTime - 1;

      if (lastTime < refTime) {
        rate.timestamp = Date.now();
        rate.count = 1;
      } else {
        rate.count += 1;
      }

      if (rate.count > this.config.get('socket.rateLimit.maxRequests')) {
        throw new Error('429_too_many_requests');
      }

      resolve();
    } catch (error) {
      reject(error);
    }
  }

  getKey(info) {
    return info.req.connection.remoteAddress;
  }
}

module.exports = RateLimiter;
