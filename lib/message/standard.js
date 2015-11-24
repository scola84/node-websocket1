'use strict';

class AbstractMessage {
  constructor(config) {
    this.config = config;
    this.binary = false;
    this.masked = false;
    this.head = '';
    this.body = '';
  }

  setBinary(binary) {
    this.binary = binary;
    return this;
  }

  isBinary() {
    return this.binary;
  }

  setMasked(masked) {
    this.masked = masked;
    return this;
  }

  isMasked() {
    return this.masked;
  }

  parseData(data) {
    this.head = this.slice(data, 0, this.config.get('socket.message.delimiter.body'));
    this.body = this.slice(data, this.config.get('socket.message.delimiter.body'));
    return this;
  }

  formatData() {
    return this.join(
      this.head,
      this.config.get('socket.message.delimiter.body'),
      this.body
    );
  }

  getBody() {
    return this.body;
  }

  setBody(body) {
    this.body = body;
    return this;
  }

  getHead() {
    return this.head;
  }

  setHead(head) {
    this.head = head;
    return this;
  }

  addHead(data) {
    this.head = this.join(data, this.config.get('socket.message.delimiter.head'), this.head);
    return this;
  }

  sliceHead() {
    return this.slice(this.head, 0, this.config.get('socket.message.delimiter.head'));
  }

  spliceHead() {
    const value = this.sliceHead();
    this.head = this.slice(this.head, this.config.get('socket.message.delimiter.head'));
    return value;
  }

  slice(data, start, end) {
    if (start && typeof start.length !== 'undefined') {
      const index = data.indexOf(start);
      start = index > -1 ? index + start.length : index;

      if (start === -1) {
        return data;
      }
    }

    if (end && typeof end.length !== 'undefined') {
      end = data.indexOf(end);

      if (end === -1) {
        return '';
      }
    }

    return data.slice(start, end);
  }

  join(...parts) {
    if (this.binary) {
      return Buffer.concat(parts.map((part) => {
        return new Buffer(part);
      }));
    }

    return parts.join('');
  }
}

module.exports = AbstractMessage;
