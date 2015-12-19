'use strict';

const EventHandler = require('@scola/events');

class Proxy extends EventHandler {
  constructor() {
    super();

    this.source = null;
    this.target = null;
  }

  open(source, target) {
    this.source = source;
    this.target = target;

    this.addMessageHandlers();

    return this;
  }

  close() {
    this.removeMessageHandlers();

    this.source = null;
    this.target = null;

    return this;
  }

  addMessageHandlers() {
    this.bindListener('message', this.source, this.handleSourceMessage);
    this.bindListener('message', this.target, this.handleTargetMessage);
  }

  removeMessageHandlers() {
    this.unbindListener('message', this.source, this.handleSourceMessage);
    this.unbindListener('message', this.target, this.handleTargetMessage);
  }

  handleSourceMessage(event) {
    this.target.send(event.message);
  }

  handleTargetMessage(event) {
    this.source.send(event.message);
  }
}

module.exports = Proxy;
