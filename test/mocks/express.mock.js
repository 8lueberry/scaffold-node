/* global sinon */
const core = require('../../src/core');

class AppMock {
  constructor() {
    this.static = sinon.stub();
    this.endpoints = {
      get: {},
      post: {},
      put: {},
      delete: {},
      use: {},
    };
    this.middlewares = [];

    this.get = sinon.stub().callsFake((endpoint, cors, fn) => {
      this.endpoints.get[endpoint] = fn || cors;
    });

    this.post = sinon.stub().callsFake((endpoint, cors, fn) => {
      this.endpoints.post[endpoint] = fn || cors;
    });

    this.put = sinon.stub().callsFake((endpoint, cors, fn) => {
      this.endpoints.put[endpoint] = fn || cors;
    });

    this.delete = sinon.stub().callsFake((endpoint, cors, fn) => {
      this.endpoints.delete[endpoint] = fn || cors;
    });

    this.use = sinon.stub().callsFake((endpoint, middleware, fn) => {
      if (!middleware && !fn) {
        // ignore error middleware for testing purposes
        if (endpoint.length === 4) {
          return;
        }

        if (Array.isArray(endpoint)) {
          endpoint.forEach(item => this.middlewares.push(item));
        } else {
          this.middlewares.push(endpoint);
        }
        return;
      }

      this.endpoints.use[endpoint] = fn;
    });
  }

  simulateCall(method, endpoint, req, res) {
    // call all the express middlewares
    this.middlewares.forEach((middleware) => {
      try {
        middleware(req, res, sinon.stub());
      } catch (err) {
        // ignore errors
      }
    });

    // call from use if found
    if (this.endpoints.use[endpoint]) {
      this.endpoints.use[endpoint](req, res);
      return;
    }

    // call all the endpoints
    if (this.endpoints[method][endpoint]) {
      this.endpoints[method][endpoint](req, res);
      return;
    }

    throw new Error(`endpoint=${endpoint} method=${method} not registered`);
  }
}

class RequestMock {
  constructor() {
    this.connection = {
      remoteAddress: '127.0.0.1',
    };
    this.headers = [];
  }
}

class ResponseMock {
  constructor() {
    this.json = sinon.stub();
    this.jsonp = sinon.stub();
    this.send = sinon.stub();
    this.set = sinon.stub();
    this.status = sinon.stub().returns(this);
    this.type = sinon.stub().returns(this);
    this.on = sinon.stub();
    this.headers = [];
    this.header = sinon.stub();
    this.setHeader = sinon.stub();

    core.middlewares.responseFormatter(null, this, () => {});
  }
}

module.exports = {
  AppMock,
  RequestMock,
  ResponseMock,
};
