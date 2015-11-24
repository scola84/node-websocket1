'use strict';

const Configuration = require('scola-config');
const DI = require('scola-di');

const ConnectionPool = require('../connection/pool');

const LoadBalancer = require('./load-balancer');
const Proxy = require('./proxy');
const Readable = require('./readable');
const WebSocketFactory = require('./websocket-factory');

class Module extends DI.Module {
  configure() {
    this.inject(LoadBalancer).with(
      this.singleton(ConnectionPool)
    );

    this.inject(Readable).with(
      this.singleton(Configuration)
    );
  }
}

module.exports = {
  LoadBalancer,
  Module,
  Proxy,
  Readable,
  WebSocketFactory
};
