'use strict';

const AbstractConnector = require('./abstract');

class ServerConnector extends AbstractConnector {
  constructor(connectionPool, connectionProvider, webSocketFactory, filters) {
    super(connectionPool, connectionProvider);

    this.webSocketFactory = webSocketFactory;

    this.filters = (filters || []).map((filter) => {
      filter.get().setConnector(this);
    });

    this.options = null;
    this.server = null;
  }

  bind(options) {
    this.options = options || {};
    this.options.headers = this.options.headers || [];
    this.options.verifyClient = this.verifyClient.bind(this);

    this.server = this.webSocketFactory.createServer(this.options);
    this.addServerHandlers();

    return this;
  }

  release() {
    this.removeServerHandlers();
    this.server.close();
    this.server = null;

    return this;
  }

  verifyClient(info, callback) {
    Promise.all(this.filters.map((filter) => {
      return filter.connect(info);
    })).then(() => {
      callback(true);
    }, (error) => {
      callback(false, error.message.slice(0, 3));
      this.handleError(error);
    });
  }

  addServerHandlers() {
    this.bindListener('connection', this.server, this.handleConnection);
    this.bindListener('error', this.server, this.handleError);
    this.bindListener('headers', this.server, this.handleHeaders);
  }

  removeServerHandlers() {
    this.unbindListener('connection', this.server);
    this.unbindListener('error', this.server);
    this.unbindListener('headers', this.server);
  }

  handleConnection(connection) {
    try {
      this.connectionProvider.get().connect(connection);
    } catch (error) {
      this.handleError(error);
    }
  }

  handleError(error) {
    this.emit('error', {
      error
    });
  }

  handleHeaders(headers) {
    this.options.headers.forEach((header) => {
      headers.push(header);
    });
  }
}

module.exports = ServerConnector;
