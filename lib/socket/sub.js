'use strict';

const AbstractSocket = require('./abstract');

class SubSocket extends AbstractSocket {
  constructor(config, connectionPool, messageProvider) {
    super(config);

    this.connectionPool = connectionPool;
    this.messageProvider = messageProvider;
  }

  subscribe(topic) {
    return this.send(topic, true);
  }

  unsubscribe(topic) {
    return this.send(topic, false);
  }

  send(topic, action) {
    topic = topic || this.config.get('socket.pubsub.defaultTopic');

    const head = topic +
      this.config.get('socket.pubsub.topicDelimiter') +
      Number(action);

    const message = this.messageProvider.get().addHead(head);
    let connection = null;

    for (connection of this.connectionPool.values()) {
      if (connection.canSend()) {
        connection.send(message);
      }
    }

    return this;
  }

  handleMessage(event) {
    this.emit('message', event);
  }
}

module.exports = SubSocket;
