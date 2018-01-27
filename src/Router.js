const assert = require('assert');
const bodyParser = require('body-parser');
const cors = require('cors');
const favicon = require('serve-favicon');
const path = require('path');
const pkg = require('../package.json');

class Router {
  constructor({
    logger,
    config,
    monitoring,
    serviceDriver,
    socketDriver,
    /* scripts/helloworld.js */
    helloworld,
    /* scripts/helloworld.js */
  }) {
    assert(logger, 'expected logger');
    assert(config, 'expected config');
    assert(monitoring, 'expected monitoring');
    assert(serviceDriver, 'expected serviceDriver');

    this.logger = logger;
    this.config = config;
    this.monitoring = monitoring;
    this.serviceDriver = serviceDriver;
    this.socketDriver = socketDriver;
    /* scripts/helloworld.js */
    this.helloworld = helloworld;
    /* scripts/helloworld.js */
  }

  registerRoutes() {
    // global middleware
    this.serviceDriver.use(favicon(path.join(__dirname, 'favicon.ico')));
    this.serviceDriver.use(bodyParser.json()); // for parsing application/json
    this.serviceDriver.use(bodyParser.urlencoded({ // application/x-www-form-urlencoded
      extended: true,
    }));

    // global routes
    this.serviceDriver.get('/health', cors(), this.handleErrors(this.healthController));
    this.serviceDriver.get('/', (req, res) => this.homeController(req, res));

    // socket
    this.socketDriver.on('connection', socket => this.socketController(socket));

    // example client page to connect with the websocket
    const socketioClientDistPath = path.join(__dirname, '../node_modules/socket.io-client/dist');
    this.serviceDriver.use('/lib', require('express').static(socketioClientDistPath)); // eslint-disable-line
    this.serviceDriver.get('/hellosocket', this.handleErrors(this.sayHelloSocketController));

    // NOTE: this is where you would register your routes

    /* scripts/helloworld.js */
    this.serviceDriver.get('/helloworld', this.handleErrors(this.sayHelloController));
    /* scripts/helloworld.js */

    // error handler, should be registered last
    this.serviceDriver.use(this.errorMiddleware.bind(this));
  }

  /**
   * GET: /home
   *
   * @param {any} req
   * @param {any} res
   * @memberof Router
   */
  homeController(req, res) {
    res.send(`<html><body>${pkg.name} v${pkg.version}</body></html>`);
  }

  /**
   * GET: /health
   *
   * @param {any} req
   * @param {any} res
   * @memberof Router
   */
  healthController(req, res) {
    const healthResult = {
      status: 200,
      monitoring: this.monitoring.getCurrentCounters(),
      // NOTE: add your test for mongodb, elasticsearch...
      // https://itwiki.ypg.com/display/DT/Monitoring
    };

    res.json(healthResult);
  }

  /**
   * Handle errors on all controllers
   *
   * @param {any} err
   * @param {any} res
   * @param {any} req
   * @param {any} next
   *
   * @memberof Router
   */
  errorMiddleware(err, req, res, /* eslint-disable */ next) {
    this.logger.error(err, 'Unexpected route error');
    const body = {
      errors: {
        codes: [err.code],
      },
    };
    res.json(body);
  }

  /**
   * Wraps the controller in an error handling code
   * This allows your controller to return a promise and errors will be handled by the error middleware
   *
   * @param {any} controller
   * @returns
   * @memberof Router
   */
  handleErrors(controller) {
    const self = this;
    return async function(req, res) {
      try {
        await controller.bind(self)(req, res);
      } catch (err) {
        self.errorMiddleware(err, req, res);
      }
    };
  }

  /* scripts/helloworld.js */
  /**
   * GET: /helloworld
   *
   * @param {any} req
   * @param {any} res
   * @memberof Router
   */
  /* istanbul ignore next: ignore test for sample code */
  async sayHelloController(req, res) {
    // NOTE: The controller is responsible to handle input and output.
    
    // NOTE: When calling your business logic, it should pass values needed explicitly.
    // Do not pass any framework object like express to the business logic.

    // NOTE: Because we registered the controller with handleErrors
    // we can return a promise or throw an error

    const result = await this.helloworld.sayHello(req.query); // input will be destructured
    const body = {
      data: result,
    };
    res.json(body);
  }
  /* scripts/helloworld.js */

  // creates a testing html page
  sayHelloSocketController(req, res) {
    res.send(`<!doctype html><html><head></head><body><div id="debug"></div><script src="/lib/socket.io.slim.js"></script><script>
  window.onload = () => {
    const socket = io();
    socket.on('hello', ({ sender }) => {
      document.getElementById('debug').innerHTML += 'Got hello from ' + sender + '<br />';
      document.getElementById('debug').innerHTML += 'Sending hello to server<br />';
      socket.emit('hello', { sender: 'browser' });
    });
  }
</script></body></html>`);
  }

  // entry point for the socket
  socketController(socket) {
    this.logger.debug('(socket) A client connected');
    socket.emit('hello', { sender: 'server' });

    socket.on('hello', ({ sender }) => {
      this.logger.debug(`(socket) Got hello from ${sender}`);
    });

    socket.on('disconnect', () => {
      this.logger.debug('(socket) A client disconnected');
    });
  }
}

module.exports = {
  Router,
};
