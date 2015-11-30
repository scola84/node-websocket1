'use strict';

const AbstractSocket = require('./abstract');

class PubSocket extends AbstractSocket {
  constructor(config) {
    super(config);
    this.subscriptions = {};
  }

  send(message) {
    const topic = String(message.sliceHead()) ||
      this.config.get('socket.pubsub.defaultTopic');

    const connections = this.getConnections(topic);
    let connection = null;

    for (connection of connections) {
      if (connection.canSend()) {
        connection.send(message);
      }
    }

    return this;
  }

  handleMessage(event) {
    const [topic, action] = String(event.message.sliceHead())
      .split(this.config.get('socket.pubsub.topicDelimiter'));

    event.topic = topic;

    if (action === '1') {
      this.handleSubscribe(event);
    } else if (action === '0') {
      this.handleUnsubscribe(event);
    }

    this.emit('message', event);
  }

  handleSubscribe(event) {
    this.subscriptions[event.topic] = this.subscriptions[event.topic] || [];

    if (this.subscriptions[event.topic].indexOf(event.connection) === -1) {
      this.subscriptions[event.topic].push(event.connection);
      this.emit('subscribe', event);
    }
  }

  handleUnsubscribe(topic, event) {
    if (this.subscriptions[event.topic]) {
      const index = this.subscriptions[event.topic].indexOf(event.connection);

      if (index !== -1) {
        this.subscriptions[event.topic].splice(index, 1);
        this.emit('subscribe', event);
      }
    }
  }

  getConnections(topic) {
    let connections = this.subscriptions[topic] || [];

    if (topic !== this.config.get('socket.pubsub.defaultTopic')) {
      connections = connections.concat(
        this.subscriptions[this.config.get('socket.pubsub.defaultTopic')] || []
      );
    }

    return connections;
  }
}

module.exports = PubSocket;
