const assert = require('assert');
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
  }

  /**
   * Starts the monitoring task
   *
   * @memberof Monitoring
   */
  async start() {
    registerEventSubscriptions.call(this, global.assembly);

    this._transports = [
      new ConsoleMonitoring(global.assembly),
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

function registerEventSubscriptions({ helloworld }) {
  if (helloworld) {
    helloworld.on('call', (name) => {
      const counter = this._counters.helloworld;
      counter.count += 1;
      counter.names[name] = counter.names[name] ? counter.names[name] + 1 : 1;
    });
  }
}

/**
 * Responsible for showing the counters on the console at an interval
 */
class ConsoleMonitoring {
  constructor({
    config,
    logger,
    monitoring,
  }) {
    assert(logger, 'expected logger');
    assert(monitoring, 'expected monitoring');
    assert(config && config.monitoring && config.monitoring.console, 'expected config.monitoring.console');

    this._logger = logger;
    this._monitoring = monitoring;
    this._interval = config.monitoring.console.interval;

    this._intervalID = null;
  }

  start() {
    if (!this._interval || this._interval <= 0) {
      return;
    }

    this._logger.info(`Monitoring.console will log every ${this._interval}ms`);
    this._intervalID = setInterval(() => {
      this._logger.info(`\n\nCounters\n--------\n\u001b[34m${JSON.stringify(this._monitoring.counters, null, '  ')}\u001b[39m\n`);
    }, this._interval);
  }

  stop() {
    if (!this._intervalID) {
      return;
    }

    this._logger.info('stopping monitoring.console');
    clearInterval(this._intervalID);
    this._intervalID = null;
  }
}

module.exports = {
  Monitoring,
};
