/* global jest */

const httpServer = {
  listen: jest.fn((port, cb) => cb()),
};

const serviceDriver = {};

const router = {
  registerRoutes: jest.fn(),
};

const logger = {
  info: jest.fn(),
};

const config = { server: { port: 123 } };

const monitoring = {
  start: jest.fn(),
};

const Assembly = jest.fn().mockImplementation(() => ({
  init: () => {},
  logger,
  config,
  serviceDriver,
  httpServer,
  monitoring,
  router,
}));

module.exports = {
  Assembly,

  mocks: {
    logger,
    config,
    serviceDriver,
    httpServer,
    monitoring,
    router,
  },
};
