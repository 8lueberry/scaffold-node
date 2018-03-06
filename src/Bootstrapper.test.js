/* global jest expect */

const { Bootstrapper } = require('./Bootstrapper');

jest.mock('./Assembly', () => ({
  Assembly: jest.fn().mockImplementation(() => ({
    init: () => {},
    logger: {
      info: jest.fn(),
    },
    config: { server: { port: 123 } },
    serviceDriver: {},
    httpServer: {
      listen: jest.fn((port, cb) => cb()),
    },
    monitoring: {
      start: jest.fn(),
    },
    router: {
      registerRoutes: jest.fn(),
    },
  })),
}));

describe('bootstrap()', () => {
  async function entry({ result }) {
    // prepare
    const bootstrapper = new Bootstrapper();

    // run
    await bootstrapper.bootstrap();

    // result
    result(bootstrapper);
  }

  test('should start service', async () => entry({
    result(bootstrapper) {
      expect(bootstrapper.assembly.httpServer.listen).toHaveBeenCalledTimes(1);
    },
  }));

  test('should start monitoring', async () => entry({
    result(bootstrapper) {
      expect(bootstrapper.assembly.monitoring.start).toHaveBeenCalledTimes(1);
    },
  }));
});
