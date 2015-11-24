'use strict';

const EventHandler = require('scola-events');

class AbstractConnector extends EventHandler {
  constructor(connectionPool, connectionProvider) {
    super();

    this.connectionPool = connectionPool;
    this.connectionProvider = connectionProvider;

    this.addPoolHandlers();
  }

  createConnection() {
    const connection = this.connectionProvider.get();

    connection.once('open', () => {
      try {
        this.connectionPool.add(connection);

        this.emit('open', {
          connection
        });
      } catch (error) {
        connection.close(1011, 'internal_error');

        this.emit('error', {
          error,
          connection
        });
      }
    });

    return connection;
  }

  addPoolHandlers() {
    this.proxyListener('open', this.connectionPool);
    this.proxyListener('error', this.connectionPool);
    this.proxyListener('message', this.connectionPool);
    this.proxyListener('send', this.connectionPool);
    this.proxyListener('close', this.connectionPool);
  }

  removePoolHandlers() {
    this.unproxyListener('open', this.connectionPool);
    this.unproxyListener('error', this.connectionPool);
    this.unproxyListener('message', this.connectionPool);
    this.unproxyListener('send', this.connectionPool);
    this.unproxyListener('close', this.connectionPool);
  }
}

module.exports = AbstractConnector;
