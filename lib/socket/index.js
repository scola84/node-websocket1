'use strict';

const Configuration = require('@scola/config');
const DI = require('@scola/di');

const Connection = require('../connection');
const Helper = require('../helper');
const Message = require('../message');

const Dealer = require('./dealer');
const Pub = require('./pub');
const Pull = require('./pull');
const Push = require('./push');
const Rep = require('./rep');
const Req = require('./req');
const Router = require('./router');
const Sub = require('./sub');

class Module extends DI.Module {
  configure() {
    this.inject(Dealer).with(
      this.singleton(Configuration),
      this.instance(Helper.LoadBalancer)
    );

    this.inject(Pub).with(
      this.singleton(Configuration)
    );

    this.inject(Pull).with(
      this.singleton(Configuration)
    );

    this.inject(Push).with(
      this.singleton(Configuration),
      this.instance(Helper.LoadBalancer)
    );

    this.inject(Rep).with(
      this.singleton(Configuration)
    );

    this.inject(Req).with(
      this.singleton(Configuration),
      this.instance(Helper.LoadBalancer)
    );

    this.inject(Router).with(
      this.singleton(Configuration),
      this.singleton(Connection.Pool)
    );

    this.inject(Sub).with(
      this.singleton(Configuration),
      this.singleton(Connection.Pool),
      this.provider(Message.Standard)
    );
  }
}

module.exports = {
  Dealer,
  Module,
  Pub,
  Pull,
  Push,
  Rep,
  Req,
  Router,
  Sub
};
