'use strict';

const EventHandler = require('@scola/events');

class ConnectionPool extends EventHandler {
  constructor(messageProvider) {
    super();

    this.messageProvider = messageProvider;

    this.ids = [];
    this.connections = new Map();
  }

  close(code, reason) {
    this.connections.forEach((connection) => {
      connection.close(code, reason);
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
  }

  delete(id) {
    const index = this.ids.indexOf(id);

    if (index === -1) {
      throw new Error('not_connected');
    }

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

  createMessage() {
    return this.messageProvider.get();
  }
}

module.exports = ConnectionPool;
