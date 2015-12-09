'use strict';

const EventHandler = require('@scola/events');

class Queue extends EventHandler {
  constructor(config) {
    super();

    this.config = config;
    this.queue = new Set();

    this.processor = null;
    this.iterator = null;

    this.paused = true;
    this.running = false;
  }

  setProcessor(processor) {
    this.processor = processor;
    return this;
  }

  start() {
    this.paused = false;
    return this;
  }

  stop() {
    this.paused = true;
    return this;
  }

  add(item) {
    let result = false;

    if (this.queue.size < this.config.get('socket.queue.highWaterMark')) {
      this.queue.add(item);
      result = true;
    }

    this.run();
    return result;
  }

  run() {
    if (this.running || this.paused) {
      return;
    }

    this.running = true;
    this.iterator = new Set(this.queue).values();
    this.process();
  }

  process() {
    const item = this.iterator.next();

    if (item.done) {
      return this.finish();
    }

    const result = this.processor(item.value);

    if (result) {
      this.queue.delete(item.value);
    }

    this.process();
  }

  finish() {
    this.running = false;
    this.iterator = null;

    if (this.queue.size) {
      this.run();
    }
  }
}

module.exports = Queue;
