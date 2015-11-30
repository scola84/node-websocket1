'use strict';

const msgpack = require('msgpack');
const AbstractFilter = require('./abstract');

class MsgPackFilter extends AbstractFilter {
  receive(message) {
    message.setBody(msgpack.unpack(message.getBody()));
  }

  send(message) {
    message.setBody(msgpack.pack(message.getBody()));
  }
}

module.exports = MsgPackFilter;
