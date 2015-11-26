'use strict';

const Configuration = require('scola-config');
const DI = require('scola-di');

const Helper = require('../helper');
const Message = require('../message');

const Client = require('./client');
const Filter = require('./filter');
const Pool = require('./pool');
const Server = require('./server');

class Module extends DI.Module {
  configure() {
    this.inject(Client).with(
      this.singleton(Pool),
      this.provider(Message.Standard),
      this.value(null),
      this.singleton(Configuration),
      this.instance(Helper.WebSocketFactory)
    );

    this.inject(Server).with(
      this.singleton(Pool),
      this.provider(Message.Standard)
    );
  }
}

module.exports = {
  Client,
  Filter,
  Module,
  Pool,
  Server
};
