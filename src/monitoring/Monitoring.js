const assert = require('assert');
const transports = require('./transports');
const { EventEmitter } = require('events');

class Monitoring extends EventEmitter {
  constructor({ config, logger }) {
    super();
    assert(logger, 'expected logger');
    assert(config, 'expected config');

    this._logger = logger;
    this._monitoringConfig = config.monitoring || {};
    this._intervals = {};
    this._counters = initialCounters();
    this._transports = [];
    this._isStarted = false;
  }

  /**
   * Starts the monitoring task
   *
   * @memberof Monitoring
   */
  async start() {
    if (this._isStarted) {
      throw new Error('Monitoring already started');
    }

    this._isStarted = true;

    registerEventSubscriptions.call(this, global.assembly);

    this._transports = [
      new transports.Console(global.assembly),
      // NOTE: you can add other transports e.g. elasticsearch
    ];

    return Promise.all(this._transports.map(t => t.start()));
  }

  /**
   * Stops the monitoring interval.
   *
   * @memberof Monitoring
   */
  async stop() {
    return Promise.all(this._transports.map(t => t.stop()));
  }

  /**
   * Gets the current counters
   */
  get counters() {
    return Object.assign({
      date: new Date(),
    }, this._counters);
  }
}

function initialCounters() {
  // NOTE: add the counters you want to store
  return {
    helloworld: {
      count: 0,
      names: {},
    },
  };
}

function registerEventSubscriptions(/* istanbul ignore next: default values */ {
  helloworld,
} = {}) {
  /* istanbul ignore next */
  if (helloworld) {
    helloworld.on('call', (name) => {
      const counter = this._counters.helloworld;
      counter.count += 1;
      counter.names[name] = counter.names[name] ? counter.names[name] + 1 : 1;
    });
  }
}

module.exports = {
  Monitoring,
};
