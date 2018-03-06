const assert = require('assert');

/**
 * Responsible for showing the counters on the console at an interval
 */
class Console {
  constructor(/* istanbul ignore next: default values */{
    config,
    logger,
    monitoring,
  } = {}) {
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
  Console,
};
