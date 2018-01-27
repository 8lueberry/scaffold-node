const assert = require('assert');
const { EventEmitter } = require('events');

const oneHour = 1 * 60 * 60 * 1000;

class Monitoring extends EventEmitter {
  constructor({ config, logger }) {
    super();
    assert(logger, 'expected logger');
    assert(config, 'expected config');

    this.logger = logger;
    this.config = config;

    this._counters = this._initialCounters();
    this._intervals = {}; // keep track of the setInterval ids
  }

  /**
   * The initial counter values
   *
   * @returns
   * @memberof Monitoring
   */
  _initialCounters() {
    // NOTE: add the counters you want to store
    return {
      /* scripts/helloworld.js */
      helloworld: {
        count: 0,
        names: {},
      },
      /* scripts/helloworld.js */
    };
  }

  /**
   * Registers to the events emited by the system components
   *
   * @memberof Monitoring
   */
  _registerEventSubscriptions({
    /* scripts/helloworld.js */
    helloworld,
    /* scripts/helloworld.js */
  }) {
    /* scripts/helloworld.js */
    /* istanbul ignore next: ignore test for sample code */
    if (helloworld) {
      helloworld.on('call', (name) => {
        const counter = this._counters.helloworld;
        counter.count++;
        counter.names[name] = counter.names[name] ? counter.names[name] + 1 : 1;
      });
    }
    /* scripts/helloworld.js */
  }

  /**
   * Starts the monitoring task
   *
   * @memberof Monitoring
   */
  async start() {
    this._registerEventSubscriptions(global.assembly);

    const monitoringConfig = this.config.monitoring || /* istanbul ignore next */ {};
    if (monitoringConfig.console) {
      this._initializeConsoleMonitoring({ consoleConfig: monitoringConfig.console });
    }

    // NOTE: you can add your code to send the monitoring data to another system
    // like elasticsearch for example
  }

  /**
   * Display to the console at an interval
   *
   * @param {any} { consoleConfig }
   * @memberof Monitoring
   */
  _initializeConsoleMonitoring({ consoleConfig }) {
    const interval = consoleConfig.interval >= 0
      ? consoleConfig.interval
      : /* istanbul ignore next */ oneHour;

    if (consoleConfig.interval <= 0) {
      return;
    }

    this.logger.info(`monitoring.console setup every ${interval}ms`);
    this._intervals.console = setInterval(() => {
      const counters = this.getCurrentCounters();
      this.logger.info(
        JSON.stringify(
          counters,
          null,
          consoleConfig.pretty ? /* istanbul ignore next */ '  ' : '',
        ));
    }, interval);
  }

  /**
   * Stops the monitoring interval.
   *
   * @memberof Monitoring
   */
  async stop() {
    Object.keys(this._intervals)
      .forEach((monitoringType) => {
        const id = this._intervals[monitoringType];
        if (id) {
          this.logger.info(`stopping monitoring.${monitoringType}`);
          clearInterval(id);
          this._intervals[monitoringType] = null;
        }
      });
  }

  /**
   * Retrieves the current service stats.
   *
   * @returns {any} - The service counter stats
   *
   * @memberof Monitoring
   */
  getCurrentCounters() {
    return this._counters;
  }
}

module.exports = {
  Monitoring,
};
