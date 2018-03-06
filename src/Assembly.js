const config = require('config');
const express = require('express');
const http = require('http');
const logger = require('./Logger');
// const socketio = require('socket.io'); // npm run snippet remove socketio
const { HelloWorld } = require('./helloworld'); // npm run snippet remove helloworld
const { Monitoring } = require('./monitoring');
const { Router } = require('./Router');

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

    this.config = config;
    this.logger = logger();

    // service
    this.serviceDriver = express();
    this.httpServer = http.Server(this.serviceDriver);
    // this.socketDriver = socketio(httpServer); // npm run snippet remove socketio

    // app instances
    this.helloworld = new HelloWorld(this); // npm run snippet remove helloworld

    // should be initialized last because it usually needs all the dependencies
    this.monitoring = new Monitoring(this);
    this.router = new Router(this);
  }
}

module.exports = {
  Assembly,
};
