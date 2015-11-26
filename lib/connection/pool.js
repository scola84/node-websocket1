'use strict';

const EventHandler = require('scola-events');

class ConnectionPool extends EventHandler {
  constructor() {
    super();

    this.ids = [];
    this.connections = new Map();
  }

  close() {
    this.connections.forEach((connection) => {
      connection.close();
    });
  }

  add(connection) {
    const id = connection.getId();
    const index = this.ids.indexOf(id);

    if (index > -1) {
      throw new Error('already_connected');
    }

    this.ids.push(id);
    this.connections.set(id, connection);
    this.addConnectionHandlers(connection);
  }

  delete(id) {
    const index = this.ids.indexOf(id);

    if (index === -1) {
      throw new Error('not_connected');
    }

    this.removeConnectionHandlers(this.connections.get(id));
    this.connections.delete(id);
    this.ids.splice(index, 1);
  }

  size() {
    return this.connections.size;
  }

  get(id) {
    return this.connections.get(id);
  }

  has(id) {
    return this.connections.has(id);
  }

  values() {
    return this.connections.values();
  }

  getByIndex(index) {
    return this.connections.get(this.ids[index]);
  }

  addConnectionHandlers(connection) {
    this.proxyListener('open', connection);
    this.proxyListener('error', connection);
    this.proxyListener('message', connection);
    this.proxyListener('send', connection);
    this.proxyListener('close', connection);
  }

  removeConnectionHandlers(connection) {
    this.unproxyListener('open', connection);
    this.unproxyListener('error', connection);
    this.unproxyListener('message', connection);
    this.unproxyListener('send', connection);
    this.unproxyListener('close', connection);
  }
}

module.exports = ConnectionPool;
