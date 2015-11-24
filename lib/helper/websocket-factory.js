'use strict';

const WebSocket = require('ws');

class WebSocketFactory {
  createConnection(options) {
    return new WebSocket(options.address, options.protocols, options);
  }

  createServer(options) {
    return new WebSocket.Server(options);
  }
}

module.exports = WebSocketFactory;
