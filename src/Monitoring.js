const assert = require('assert');
const { EventEmitter } = require('events');

const oneHour = 1 * 60 * 60 * 1000;

class Monitoring extends EventEmitter {
  constructor({ config, logger }) {
    super();
    assert(logger, 'expected logger');
    assert(config, 'expected config');

    this._logger = logger;
    this._monitoringConfig = config.monitoring || {};
    this._intervals = {}; // keep track of the setInterval ids
    this._counters = createInitialCounters.call(this);
  }

  /**
   * Starts the monitoring task
   *
   * @memberof Monitoring
   */
  async start() {
    registerEventSubscriptions.call(this, global.assembly);
    initializeMonitoringTransports.call(this, global.assembly);
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
   * Gets the current counters
   */
  get counters() {
    return Object.assign({
      date: new Date(),
    }, this._counters);
  }
}

function createInitialCounters() {
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

function initializeMonitoringTransports() {
  if (this._monitoringConfig.console) {
    initializeConsoleMonitoring.call(this, this._monitoringConfig.console);
  }

  // NOTE: you can add your code to send the monitoring data to another system
  // like elasticsearch for example
}

function initializeConsoleMonitoring({
  interval = oneHour,
  pretty = false,
}) {
  if (interval <= 0) {
    return;
  }

  this.logger.info(`monitoring.console setup every ${interval}ms`);
  this._intervals.console = setInterval(() => {
    const counters = this.getCurrentCounters();
    this.logger.info(JSON.stringify(
      counters,
      null,
      pretty ? '  ' : '',
    ));
  }, interval);
}

module.exports = {
  Monitoring,
};
