'use strict';

const AbstractSocket = require('./abstract');

class RouterSocket extends AbstractSocket {
  constructor(config, connectionPool) {
    super(config);
    this.connectionPool = connectionPool;
  }

  send(message) {
    const connectionId = String(message.spliceHead());
    const connection = this.connectionPool.get(connectionId);

    if (connection && connection.canSend()) {
      connection.send(message);
    }

    return this;
  }

  handleMessage(event) {
    event.message.addHead(event.connection.getId());
    this.emit('message', event);
  }
}

module.exports = RouterSocket;
