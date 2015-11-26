'use strict';

const AbstractConnector = require('./abstract');

class ServerConnector extends AbstractConnector {
  constructor(connectionPool, connectionProvider, webSocketFactory, filters) {
    super(connectionPool, connectionProvider);

    this.webSocketFactory = webSocketFactory;
    this.filters = filters || [];

    this.options = null;
    this.server = null;
  }

  bind(options) {
    this.options = options || {};
    this.options.headers = this.options.headers || [];
    this.options.verifyClient = this.verifyClient.bind(this);

    this.server = this.webSocketFactory.createServer(this.options);
    this.setFilters();
    this.addServerHandlers();

    return this;
  }

  release() {
    this.connectionPool.close();
    this.removeServerHandlers();
    this.server.close();

    return this;
  }

  verifyClient(info, callback) {
    Promise.all(this.filters.map((filter) => {
      return filter.filterConnect(info);
    })).then(() => {
      callback(true);
    }).catch((error) => {
      this.handleError(error);
      callback(false, 403);
    });
  }

  setFilters() {
    this.filters.forEach((filter) => {
      filter.setConnector(this);
    });
  }

  addServerHandlers() {
    this.bindListener('connection', this.server, this.handleConnection);
    this.bindListener('headers', this.server, this.handleHeaders);
    this.bindListener('error', this.server, this.handleError);
  }

  removeServerHandlers() {
    this.unbindListener('connection', this.server);
    this.unbindListener('headers', this.server);
    this.unbindListener('error', this.server);
  }

  handleConnection(connection) {
    this.connectionProvider.get().open(connection);
  }

  handleHeaders(headers) {
    this.options.headers.forEach((header) => {
      headers.push(header);
    });
  }

  handleError(error) {
    this.emit('error', {
      error
    });
  }
}

module.exports = ServerConnector;
