const assert = require('assert');
const bodyParser = require('body-parser');
const cors = require('cors');
const favicon = require('serve-favicon');
const path = require('path');
const pkg = require('../package.json');

/**
 * The router class is responsible to register the service endpoints
 */
class Router {
  constructor({
    logger,
    monitoring,
    serviceDriver,
    // socketDriver, // npm run snippet remove socketio
    helloworld, // npm run snippet remove helloworld
  }) {
    assert(logger, 'expected logger');
    assert(monitoring, 'expected monitoring');
    assert(serviceDriver, 'expected serviceDriver');

    this._logger = logger;
    this._monitoring = monitoring;
    this._serviceDriver = serviceDriver;
    // this._socketDriver = socketDriver; // npm run snippet remove socketio
    this._helloworld = helloworld; // npm run snippet remove helloworld
  }

  registerRoutes() {
    const handleAsync = runAsyncAndHandleErrors.bind(this); // TODO how to make this cleaner

    // global middleware
    this._serviceDriver.use(favicon(path.join(__dirname, 'favicon.ico')));
    this._serviceDriver.use(bodyParser.json()); // application/json
    this._serviceDriver.use(bodyParser.urlencoded({ // application/x-www-form-urlencoded
      extended: true,
    }));

    /* npm run snippet remove socketio
    // socket.io
    this._socketDriver.on('connection', this.socketController);

    const socketioClientDistPath = path.join(__dirname, '../node_modules/socket.io-client/dist');
    this._serviceDriver.use('/hellosocket/lib', require('express').static(socketioClientDistPath));
    this._serviceDriver.get('/hellosocket', this.handleErrors(this.sayHelloSocketController));
    // npm run snippet remove socketio */

    // global routes
    this._serviceDriver.get('/', handleAsync(homeController));
    this._serviceDriver.get('/health', cors(), handleAsync(healthController));

    this._serviceDriver.get('/helloworld', handleAsync(sayHelloController)); // npm run snippet remove helloworld

    // error handler, should be registered last
    this._serviceDriver.use(errorMiddleware.bind(this));
  }
}

/**
 * Wraps the controller in an error handling code
 * This allows your controller to be async where errors will be handled
 *
 * @param {any} controller
 * @returns
 * @memberof Router
 */
function runAsyncAndHandleErrors(controller) {
  const context = this;
  return async function doHandleErrors(req, res) {
    try {
      await controller.call(context, req, res);
    } catch (err) {
      errorMiddleware.call(context, err, req, res);
    }
  };
}

/**
 * Handle errors on all controllers
 */
function errorMiddleware(err, req, res, /* eslint-disable */ next) {
  this._logger.error({
    message: 'Unexpected route error',
    err,
  });

  const body = {
    errorMessage: err.message,
  };
  res.json(body);
}

/**
 * GET: /
 */
function homeController(req, res) {
  res.send(`<html><body>${pkg.name} v${pkg.version}</body></html>`);
}

/**
 * GET: /health
 */
function healthController(req, res) {
  const healthResult = {
    status: 'ok',
    monitoring: this._monitoring.counters,
    // NOTE: you can add your own monitoring stats here (e.g. db status)
  };

  res.json(healthResult);
}

// /* npm run snippet remove helloworld
/**
 * GET: /helloworld
 */
/* istanbul ignore next */
async function sayHelloController(req, res) {
  // NOTE: The controller is responsible to handle input and output.

  // NOTE: When calling your business logic, it should pass values needed explicitly.
  // Do not pass any framework object like express to the business logic.

  // NOTE: Because we registered the controller with runAsyncAndHandleErrors
  // we can return a promise or throw an error

  const result = await this._helloworld.sayHello(req.query); // input will be destructured
  res.json({
    data: result,
  });
}
// npm run snippet remove socketio */

/* npm run snippet remove socketio
function sayHelloSocketController(req, res) {
  res.send(`<!doctype html><html><body><script src="/hellosocket/lib/socket.io.slim.js"></script><script>
window.onload = () => {
  const socket = io();
  socket.on('hello', ({ sender }) => {
    document.write('Got hello from ' + sender + '<br />');
    document.write('Sending hello to server<br />');
    socket.emit('hello', { sender: 'browser' });
  });
}
</script></body></html>`);
}

function socketController(socket) {
  this._logger.debug('(socket) A client connected');
  socket.emit('hello', { sender: 'server' });

  socket.on('hello', ({ sender }) => {
    this._logger.debug(`(socket) Got hello from ${sender}`);
  });

  socket.on('disconnect', () => {
    this._logger.debug('(socket) A client disconnected');
  });
}
// npm run snippet remove socketio */

module.exports = {
  Router,
};
