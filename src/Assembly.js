const config = require('config');
const express = require('express');
const http = require('http');
// const socketio = require('socket.io'); // scaffold-script socketio.js
const winston = require('winston');
const { Monitoring } = require('./Monitoring');
const { Router } = require('./Router');

/* scripts/helloworld.js */
const { HelloWorld } = require('./helloworld/HelloWorld');
/* scripts/helloworld.js */

/**
 * This class is responsible to build all the application common dependencies
 *
 * @class Assembly
 */
class Assembly {
  /**
   * Initializes all the shared instances.
   *
   * @returns
   *
   * @memberof Assembly
   */
  async init() {
    // core
    global.assembly = this;

    this.logger = initLogger();
    this.config = config;

    // service
    this.serviceDriver = express();
    this.httpServer = http.Server(this.serviceDriver);
    // this.socketDriver = socketio(httpServer); // scaffold-script socketio.js

    // deployment tools
    // require('newrelic'); // eslint-disable-line global-require // scaffold-script socketio.js

    // app instances
    /* scripts/helloworld.js */
    this.helloworld = new HelloWorld(this);
    /* scripts/helloworld.js */

    // should be initialized last because it usually needs all the dependencies
    this.monitoring = new Monitoring(this);
    this.router = new Router(this);
  }
}

function initLogger() {
  const result = winston.createLogger({
    transports: [
      initLoggerConsoleTransport(),
    ],
  });

  return result;
}

function initLoggerConsoleTransport() {
  const levels = {
    levels: {
      error: 0,
      warn: 1,
      info: 2,
      debug: 3,
    },
    colors: {
      error: 'red',
      warn: 'yellow',
      info: 'green',
      debug: 'blue',
    },
  };

  const {
    printf,
    timestamp,
    combine,
    colorize,
  } = winston.format;

  return new winston.transports.Console({
    levels,
    format: combine(
      colorize(),
      timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      printf(i => `${i.level} \u001b[36m${i.timestamp}\u001b[39m ${i.message}`),
    ),
  });
}

module.exports = {
  Assembly,
};
