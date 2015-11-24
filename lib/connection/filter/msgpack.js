'use strict';

const msgpack = require('msgpack');
const AbstractFilter = require('./abstract');

class MsgPackFilter extends AbstractFilter {
  filterReceive(message) {
    message.setBody(msgpack.unpack(message.getBody()));
  }

  filterSend(message) {
    message.setBody(msgpack.pack(message.getBody()));
  }
}

module.exports = MsgPackFilter;
