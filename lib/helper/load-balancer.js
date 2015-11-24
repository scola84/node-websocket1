'use strict';

class LoadBalancer {
  constructor(connectionPool) {
    this.connectionPool = connectionPool;
    this.pointer = -1;
  }

  getConnection() {
    return this.findConnection(this.pointer);
  }

  findConnection(start) {
    this.pointer =
      this.pointer < this.connectionPool.size() - 1 ?
      this.pointer + 1 :
      0;

    const connection = this.connectionPool.getByIndex(this.pointer);

    if (connection && connection.canSend()) {
      return connection;
    } else if (this.pointer === start) {
      throw new Error('no_connection');
    }

    return this.getConnection(start);
  }
}

module.exports = LoadBalancer;
