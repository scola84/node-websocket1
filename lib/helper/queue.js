'use strict';

const EventHandler = require('scola-events');

class Queue extends EventHandler {
  constructor() {
    super();
    this.messages = [];
  }

  add(message) {
    this.messages.push(message);
  }

  process() {
    if (this.messages.length) {
      this.emit('message', this.messages.splice(0, 1).pop());
      this.process();
    }
  }
}

module.exports = Queue;
