'use strict';

const AbstractSocket = require('./abstract');

class RouterSocket extends AbstractSocket {
  constructor(config, connectionPool) {
    super(config);
    this.connectionPool = connectionPool;
  }

  send(message) {
    const connectionId = String(message.spliceHead());

    if (!connectionId) {
      throw new Error('no_connection_id');
    }

    if (!this.connectionPool.has(connectionId)) {
      throw new Error('no_connection');
    }

    this.connectionPool.get(connectionId).send(message);

    return this;
  }

  handleMessage(event) {
    event.message.addHead(event.connection.getId());
    super.handleMessage(event);
  }
}

module.exports = RouterSocket;
