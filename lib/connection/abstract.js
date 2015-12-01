'use strict';

const cuid = require('cuid');
const EventHandler = require('scola-events');

class AbstractConnection extends EventHandler {
  constructor(connectionPool, messageProvider, filters) {
    super();

    this.connectionPool = connectionPool;
    this.messageProvider = messageProvider;
    this.filters = filters || [];

    this.filters.forEach((filter) => {
      filter.setConnection(this);
    });

    this.id = cuid();
    this.connection = null;
  }

  getId() {
    return this.id;
  }

  close(code, reason) {
    this.connection.close(code, reason);
    this.connection = null;

    this.handleClose(code, reason);
    return this;
  }

  canSend() {
    return this.connection.readyState === this.connection.OPEN;
  }

  send(message) {
    this.filters.slice().reverse().forEach((filter) => {
      filter.send(message);
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

  handleClose(code, reason) {
    try {
      this.removeConnectionHandlers();
      this.connectionPool.delete(this.id);

      this.connectionPool.emit('close', {
        code,
        reason,
        connection: this
      });
    } catch (error) {
      this.handleError(error);
    }
  }

  handleError(error) {
    this.connectionPool.emit('error', {
      error,
      connection: this
    });
  }

  handleMessage(data, options) {
    try {
      const message = this.messageProvider
        .get()
        .setBinary(options.binary)
        .setMasked(options.masked)
        .parseData(data);

      this.filters.forEach((filter) => {
        filter.receive(message);
      });

      this.connectionPool.emit('message', {
        message,
        connection: this
      });
    } catch (error) {
      this.handleError(error);
    }
  }

  handleOpen(connection) {
    try {
      this.connection = connection;
      this.connectionPool.add(this);
      this.addConnectionHandlers();

      this.connectionPool.emit('open', {
        connection: this
      });
    } catch (error) {
      connection.close(1011, 'internal_error');
      this.handleError(error);
    }
  }

  handleSend(message, error) {
    if (error) {
      this.handleError(error);
      return;
    }

    this.connectionPool.emit('send', {
      message,
      connection: this
    });
  }
}

module.exports = AbstractConnection;
