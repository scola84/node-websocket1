'use strict';

const AbstractConnection = require('./abstract');

class ClientConnection extends AbstractConnection {
  constructor(connectionPool, messageProvider, filters, config, webSocketFactory) {
    super(connectionPool, messageProvider, filters);

    this.config = config;
    this.webSocketFactory = webSocketFactory;

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
    const connection = this.webSocketFactory.createConnection(this.options);

    connection.on('error', () => {
      connection.removeAllListeners();
      this.handleReconnect();
    });

    connection.on('open', () => {
      this.attempts = 0;

      connection.removeAllListeners();
      this.handleOpen(connection);
    });
  }

  handleReconnect() {
    clearTimeout(this.timeout);

    if (this.attempts === this.config.get('socket.reconnect.maxAttempts')) {
      return;
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
    super.handleClose(code, reason);

    if (this.config.get('socket.reconnect.codes').indexOf(code) !== -1) {
      return this.handleReconnect();
    }
  }

  calculateDelay() {
    return Math.random() * Math.min(
      this.config.get('socket.reconnect.maxInterval'),
      Math.pow(2, this.attempts) * 1000
    );
  }
}

module.exports = ClientConnection;
