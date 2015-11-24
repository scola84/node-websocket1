'use strict';

const StandardMessage = require('./standard');

class StreamMessage extends StandardMessage {
  constructor(config, readableProvider) {
    super(config);
    this.readableProvider = readableProvider;
  }

  formatData() {
    return this.readableProvider.get()
      .setStream(this.body)
      .setMessage(this);
  }
}

module.exports = StreamMessage;
