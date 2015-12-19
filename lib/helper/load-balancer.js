'use strict';

const EventHandler = require('@scola/events');

class LoadBalancer extends EventHandler {
  constructor(connectionPool, queue) {
    super();

    this.connectionPool = connectionPool;
    this.queue = queue;
    this.pointer = 0;

    this.queue.setProcessor(this.handleQueue.bind(this));
    this.addHandlers();
  }

  send(message) {
    const result = this.queue.add(message);

    if (!result) {
      this.connectionPool.emit('error', {
        error: new Error('hwm_reached'),
        message
      });
    }
  }

  addHandlers() {
    this.bindListener('open', this.connectionPool, this.handleOpen);
    this.bindListener('close', this.connectionPool, this.handleClose);
  }

  removeHandlers() {
    this.unbindListener('open', this.connectionPool, this.handleOpen);
    this.unbindListener('close', this.connectionPool, this.handleClose);
  }

  handleOpen() {
    this.queue.start();
  }

  handleClose() {
    if (this.connectionPool.size() === 0) {
      this.queue.stop();
    }
  }

  handleQueue(message) {
    const connection = this.findConnection(this.pointer);

    if (connection) {
      connection.send(message);
      return true;
    }

    return false;
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
