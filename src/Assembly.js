const appConfig = require('config');
const express = require('express');
const fs = require('fs');
const http = require('http');
const pkg = require('../package.json');
/* scripts/socketio.js
const socketio = require('socket.io');
scripts/socketio.js */
const util = require('util');
const winston = require('winston');
const { Monitoring } = require('./Monitoring');
const { Router } = require('./Router');

/* scripts/helloworld.js */
const { HelloWorld } = require('./helloworld/HelloWorld');
/* scripts/helloworld.js */

const readFile = util.promisify(fs.readFile);

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
  async init(/* istanbul ignore next: default values */ {
    externalConfigPath = '/run/config/ypcloud.io/config.json' } = {}
  ) {
    // core
    this.assembly = this;
    this.logger = await this._initLogger();
    this._initGlobal();

    // tools
    /* scripts/newrelic.js
    require('newrelic'); // eslint-disable-line global-require
    scripts/newrelic.js */

    // configs
    this.config = await this._initConfig({ externalConfigPath });

    // service
    const serviceItems = await this._initService();
    this.serviceDriver = serviceItems.serviceDriver;
    this.httpServer = serviceItems.httpServer;
    /* scripts/socketio.js
    this.socketDriver = serviceItems.socketDriver;
    scripts/socketio.js */

    // db connections
    this.connections = await this._initConnections();

    // app instances
    await this._initAppInstances();

    // should be initialized last because it usually needs all the dependencies
    this.monitoring = new Monitoring(this);
    this.router = new Router(this);
  }

  /**
   * This is where you would create your app instances.
   *
   * @memberof Assembly
   */
  async _initAppInstances() {
    // NOTE: Creation order is important.

    /* scripts/helloworld.js */
    this.helloworld = new HelloWorld(this);
    /* scripts/helloworld.js */
  }

  /**
   * Insert some items that available globally
   * NOTE: Add only lightweight helper items, global should be avoided for business logic classes
   *
   * @memberof Assembly
   */
  _initGlobal() {
    global.assembly = this.assembly;
  }

  /**
   * Create the config objects. The config object consists of the local config `/config/*`
   * in addition to the console config specified in the yp console https://console-develop.ypcloud.io/manage
   * The console config will override existing configs if they exist in the local configs.
   *
   * @param {any} { externalConfigPath }
   * @returns
   * @memberof Assembly
   */
  async _initConfig({ externalConfigPath }) {
    return appConfig;
  }

  /**
   * Create the logger object. The logger used is the 'yp-logger' object that uses 'pino'
   * internally.
   *
   * @returns
   * @memberof Assembly
   */
  async _initLogger() {
    return winston;
  }

  /**
   * Create the service driver objects (and their dependencies). The default driver is
   * express.
   *
   * @returns
   * @memberof Assembly
   */
  async _initService() {
    const serviceDriver = express();
    const httpServer = http.Server(serviceDriver);
    /* scripts/socketio.js
    const socketDriver = socketio(httpServer);
    scripts/socketio.js */
    
    return {
      httpServer,
      serviceDriver,
      /* scripts/socketio.js
      socketDriver,
      scripts/socketio.js */
    };
  }

  /**
   * Create db connections here. This is where we can initialize connections that
   * are shared throughout the project. We can also handle reconnections here.
   *
   * @memberof Assembly
   */
  async _initConnections() {
    // NOTE: Put shared connections here.
    // As a good practice, connection error handling should be done here
    // Return a promise for flexibility (see /src/helloworld/HelloWorld.js for usage example)

    // const { MongoClient } = require('mongodb');
    // const myConnectionMongo = Promise.resolve()
    //   .then(() => MongoClient.connect('mongodb://localhost:27017/test?authSource=admin&readPreference=secondaryPrefered'))
    //   .catch((err) => {
    //     this.logger.error(err);
    //     throw new Error(`Error while connecting to mongodb://localhost (${err.message})`);
    //   });

    return {
      // myConnectionMongo,
    };
  }

  /**
   * Cleans the instances. When the app stops, this method is called. We can put db
   * connections disconnection for example.
   *
   * @memberof Assembly
   */
  async clean() {
    // NOTE: This is where you put your cleaning before the process exits
  }
}

module.exports = {
  Assembly,
};
