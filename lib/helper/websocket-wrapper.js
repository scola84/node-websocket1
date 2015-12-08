'use strict';

const EventHandler = require('scola-events');

class WebSocketWrapper extends EventHandler {
  constructor(...args) {
    super();

    this.websocket = new WebSocket(...args);
    this.addHandlers();
  }

  static exists() {
    return Boolean(WebSocket);
  }

  close(code, reason) {
    this.removeHandlers();
    this.websocket.close(1000, reason);
  }

  send(...args) {
    this.websocket.send(...args);
  }

  addHandlers() {
    this.websocket.onclose = this.handleClose.bind(this);
    this.websocket.onerror = this.handleError.bind(this);
    this.websocket.onmessage = this.handleMessage.bind(this);
    this.websocket.onopen = this.handleOpen.bind(this);
  }

  removeHandlers() {
    this.websocket.onclose = null;
    this.websocket.onerror = null;
    this.websocket.onmessage = null;
    this.websocket.onopen = null;
  }

  handleClose(event) {
    this.emit('close', event.code, event.reason);
  }

  handleError() {
    this.emit('error', new Error('WebSocket Error'));
  }

  handleMessage(event) {
    this.emit('message', event.data, {
      binary: typeof event.data === 'string' ? false : true,
      masked: false
    });
  }

  handleOpen() {
    this.emit('open');
  }
}

module.exports = WebSocketWrapper;
