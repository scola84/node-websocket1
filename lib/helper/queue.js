'use strict';

const EventHandler = require('scola-events');

class Queue extends EventHandler {
  constructor(config) {
    super();

    this.config = config;
    this.messages = [];
    this.state = 'idle';
  }

  isProcessing() {
    return this.state === 'processing';
  }

  add(message) {
    if (this.messages.length <= this.config.get('socket.queue.highWaterMark')) {
      this.messages.push(message);
      return;
    }

    this.emit('error', {
      error: new Error('hwm'),
      message
    });
  }

  process() {
    if (this.isProcessing()) {
      return;
    }

    this.state = 'processing';
    this.next();
  }

  next() {
    if (!this.messages.length) {
      this.state = 'idle';
      return;
    }

    this.emit('message', this.messages.splice(0, 1).pop());

    setTimeout(
      this.next.bind(this),
      this.config.get('socket.queue.processInterval')
    );
  }
}

module.exports = Queue;
