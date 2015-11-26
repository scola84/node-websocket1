'use strict';

const EventHandler = require('scola-events');

class LoadBalancer extends EventHandler {
  constructor(connectionPool, queue) {
    super();

    this.connectionPool = connectionPool;
    this.queue = queue;
    this.pointer = -1;

    this.addHandlers();
  }

  send(message) {
    const connection = this.findConnection(this.pointer);

    if (connection) {
      connection.send(message);
      return connection;
    }

    this.queue.add(message);
  }

  addHandlers() {
    this.bindListener('open', this.connectionPool, this.handleOpen);
    this.bindListener('message', this.queue, this.handleMessage);
  }

  removeHandlers() {
    this.unbindListener('open', this.connectionPool);
    this.unbindListener('message', this.queue);
  }

  handleOpen() {
    this.queue.process();
  }

  handleMessage(message) {
    this.send(message);
  }

  findConnection(start) {
    this.pointer =
      this.pointer < this.connectionPool.size() - 1 ?
      this.pointer + 1 :
      0;

    const connection = this.connectionPool.getByIndex(this.pointer);

    if (connection && connection.canSend()) {
      return connection;
    } else if (this.pointer === start) {
      return null;
    }

    return this.findConnection(start);
  }
}

module.exports = LoadBalancer;
