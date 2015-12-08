'use strict';

const WebSocket = require('ws');
const WebSocketWrapper = require('./websocket-wrapper');

class WebSocketFactory {
  createConnection(options) {
    if (WebSocketWrapper.exists()) {
      return new WebSocketWrapper(options.address, options.protocols, options);
    }

    return new WebSocket(options.address, options.protocols, options);
  }

  createServer(options) {
    return new WebSocket.Server(options);
  }
}

module.exports = WebSocketFactory;
