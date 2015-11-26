'use strict';

const AbstractConnection = require('./abstract');

class ClientConnection extends AbstractConnection {
  constructor(connectionPool, messageProvider, filters, config, webSocketFactory) {
    super(connectionPool, messageProvider, filters);

    this.config = config;
    this.webSocketFactory = webSocketFactory;
    this.reconnectCodes = [1012, 1013];

    this.attempts = 0;
    this.options = null;
    this.timeout = null;
  }

  connect(options) {
    this.options = options;
    this.handleConnect();

    return this;
  }

  handleConnect() {
    this.handleOpen(this.webSocketFactory.createConnection(this.options));
  }

  handleOpen(connection) {
    connection.once('open', () => {
      this.attempts = 0;
    });

    super.handleOpen(connection);
  }

  handleReconnect() {
    clearTimeout(this.timeout);

    if (this.attempts === this.config.get('socket.reconnect.maxAttempts')) {
      return super.handleClose(1001, 'reconnect_max_attempts');
    }

    if (this.connection) {
      this.removeConnectionHandlers();
    }

    this.timeout = setTimeout(
      this.handleConnect.bind(this),
      this.calculateDelay()
    );

    this.attempts += 1;
  }

  handleError(error) {
    if (this.connection.readyState === this.connection.CONNECTING) {
      return this.handleReconnect();
    }

    super.handleError(error);
  }

  handleClose(code, reason) {
    if (this.reconnectCodes.indexOf(code) !== -1) {
      return this.handleReconnect();
    }

    super.handleClose(code, reason);
  }

  calculateDelay() {
    return Math.random() * Math.min(
      this.config.get('socket.reconnect.maxInterval'),
      Math.pow(2, this.attempts) * 1000
    );
  }
}

module.exports = ClientConnection;
