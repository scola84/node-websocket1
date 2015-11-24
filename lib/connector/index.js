'use strict';

const Configuration = require('scola-config');
const DI = require('scola-di');

const Connection = require('../connection');
const Helper = require('../helper');

const Client = require('./client');
const Filter = require('./filter');
const Server = require('./server');

class Module extends DI.Module {
  configure() {
    this.inject(Client).with(
      this.singleton(Connection.Pool),
      this.provider(Connection.Client)
    );

    this.inject(Server).with(
      this.singleton(Connection.Pool),
      this.provider(Connection.Server),
      this.instance(Helper.WebSocketFactory)
    );

    this.inject(Filter.RateLimiter).with(
      this.singleton(Configuration)
    );
  }
}

module.exports = {
  Client,
  Filter,
  Module,
  Server
};
