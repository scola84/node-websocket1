'use strict';

const ReadableStream = require('stream').Readable;

class Readable extends ReadableStream {
  constructor(config) {
    super();

    this.config = config;
    this.stream = null;
    this.message = null;
    this.pointer = 0;
  }

  setStream(stream) {
    this.stream = stream;

    this.stream.on('readable', () => {
      this.read(0);
    });

    this.stream.on('end', () => {
      this.push(null);
    });

    return this;
  }

  setMessage(message) {
    this.message = message;
    return this;
  }

  _read(size) {
    if (this.pointer === 0) {
      this.push(this.message.getHead());
      this.push(this.config.get('socket.message.delimiter.body'));
      this.pointer += 1;
    }

    this.push(this.stream.read(size) || '');
  }
}

module.exports = Readable;
