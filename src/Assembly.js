const appConfig = require('config');
const express = require('express');
const http = require('http');
const socketio = require('socket.io');
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
    this.assembly = this;
    this.logger = this._initLogger();
    this._initGlobal();

    // tools

    // configs
    this.config = this._initConfig();

    // service
    const serviceItems = await this._initService();
    this.serviceDriver = serviceItems.serviceDriver;
    this.httpServer = serviceItems.httpServer;
    this.socketDriver = serviceItems.socketDriver;

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
  _initConfig() {
    return appConfig;
  }

  /**
   * Create the logger object. The logger used is the 'yp-logger' object that uses 'pino'
   * internally.
   *
   * @returns
   * @memberof Assembly
   */
  _initLogger() {
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
    const socketDriver = socketio(httpServer);

    return {
      httpServer,
      serviceDriver,
      socketDriver,
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
}

module.exports = {
  Assembly,
};
