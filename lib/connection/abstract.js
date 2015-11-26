'use strict';

const cuid = require('cuid');
const EventHandler = require('scola-events');

class AbstractConnection extends EventHandler {
  constructor(connectionPool, messageProvider, filters) {
    super();

    this.connectionPool = connectionPool;
    this.messageProvider = messageProvider;
    this.filters = filters || [];

    this.id = cuid();
    this.connection = null;
  }

  getId() {
    return this.id;
  }

  close(code, reason) {
    this.connection.close(code, reason);
    this.connectionPool.delete(this.id);
    this.handleClose(code, reason);

    return this;
  }

  canSend() {
    return this.connection.readyState === this.connection.OPEN;
  }

  send(message) {
    this.filters.slice().reverse().forEach((filter) => {
      filter.filterSend(message);
    });

    this.connection.send(
      message.formatData(), {
        binary: message.isBinary(),
        mask: message.isMasked()
      },
      this.handleSend.bind(this, message)
    );

    return this;
  }

  setFilters() {
    this.filters.forEach((filter) => {
      filter.setConnection(this);
    });
  }

  addConnectionHandlers() {
    this.bindListener('close', this.connection, this.handleClose);
    this.bindListener('error', this.connection, this.handleError);
    this.bindListener('message', this.connection, this.handleMessage);
  }

  removeConnectionHandlers() {
    this.unbindListener('close', this.connection);
    this.unbindListener('error', this.connection);
    this.unbindListener('message', this.connection);
  }

  handleOpen(connection) {
    try {
      this.connection = connection;
      this.connectionPool.add(this);

      this.setFilters();
      this.addConnectionHandlers();

      this.emit('open', {
        connection: this
      });
    } catch (error) {
      connection.close(1011, 'internal_error');

      this.connectionPool.emit('error', {
        error,
        connection: this
      });
    }
  }

  handleClose(code, reason) {
    this.removeConnectionHandlers();

    this.emit('close', {
      code,
      reason,
      connection: this
    });
  }

  handleError(error) {
    this.emit('error', {
      error,
      connection: this
    });
  }

  handleMessage(data, options) {
    try {
      const message = this.messageProvider.get();
      message.setBinary(options.binary);
      message.setMasked(options.masked);
      message.parseData(data);

      this.filters.forEach((filter) => {
        filter.filterReceive(message);
      });

      this.emit('message', {
        message,
        connection: this
      });
    } catch (error) {
      this.emit('error', {
        error,
        connection: this
      });
    }
  }

  handleSend(message, error) {
    if (error) {
      return this.emit('error', {
        error,
        message,
        connection: this
      });
    }

    this.emit('send', {
      message,
      connection: this
    });
  }
}

module.exports = AbstractConnection;
