'use strict';

const Configuration = require('@scola/config');
const DI = require('@scola/di');

const Helper = require('../helper');

const Standard = require('./standard');
const Stream = require('./stream');

class Module extends DI.Module {
  configure() {
    this.inject(Standard).with(
      this.singleton(Configuration)
    );

    this.inject(Stream).with(
      this.singleton(Configuration),
      this.provider(Helper.Readable)
    );
  }
}

module.exports = {
  Module,
  Standard,
  Stream
};
