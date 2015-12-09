'use strict';

const DI = require('@scola/di');

const Connection = require('./lib/connection');
const Connector = require('./lib/connector');
const Helper = require('./lib/helper');
const Message = require('./lib/message');
const Socket = require('./lib/socket');

class Module extends DI.Module {
  configure() {
    this.addModule(Connection.Module);
    this.addModule(Connector.Module);
    this.addModule(Helper.Module);
    this.addModule(Message.Module);
    this.addModule(Socket.Module);
  }
}

module.exports = {
  Connection,
  Connector,
  Helper,
  Message,
  Module,
  Socket
};
