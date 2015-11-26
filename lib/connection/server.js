'use strict';

const AbstractConnection = require('./abstract');

class ServerConnection extends AbstractConnection {
  constructor(connectionPool, messageProvider, filters) {
    super(connectionPool, messageProvider, filters);
    this.identity = null;
  }

  getIdentity() {
    return this.identity;
  }

  setIdentity(identity) {
    this.identity = identity;
    return this;
  }

  open(connection) {
    if (connection.upgradeReq.scolaIdentity) {
      this.identity = connection.upgradeReq.scolaIdentity;
      delete connection.upgradeReq.scolaIdentity;
    }

    if (connection.upgradeReq.scolaConnectionId) {
      this.id = this.connection.upgradeReq.scolaConnectionId;
      delete connection.upgradeReq.scolaConnectionId;
    }

    this.handleOpen(connection);

    return this;
  }
}

module.exports = ServerConnection;
