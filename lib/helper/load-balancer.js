'use strict';

const EventHandler = require('scola-events');

class LoadBalancer extends EventHandler {
  constructor(connectionPool, queue) {
    super();

    this.connectionPool = connectionPool;
    this.queue = queue;
    this.pointer = 0;

    this.addHandlers();
  }

  send(message) {
    if (!this.queue.isProcessing()) {
      return this.handleMessage(message);
    }

    this.queue.add(message);
  }

  addHandlers() {
    this.bindListener('error', this.queue, this.handleError);
    this.bindListener('message', this.queue, this.handleMessage);
    this.bindListener('open', this.connectionPool, this.handleOpen);
  }

  removeHandlers() {
    this.unbindListener('error', this.queue);
    this.unbindListener('message', this.queue);
    this.unbindListener('open', this.connectionPool);
  }

  handleError(event) {
    this.connectionPool.emit('error', event);
  }

  handleMessage(message) {
    const connection = this.findConnection(this.pointer);

    if (connection) {
      return connection.send(message);
    }

    this.queue.add(message);
  }

  handleOpen() {
    this.queue.process();
  }

  findConnection(start) {
    const connection = this.connectionPool.getByIndex(this.pointer);

    this.pointer =
      this.pointer < this.connectionPool.size() - 1 ?
      this.pointer + 1 :
      0;

    if (connection && connection.canSend()) {
      return connection;
    } else if (this.pointer === start) {
      return null;
    }

    return this.findConnection(start);
  }
}

module.exports = LoadBalancer;
