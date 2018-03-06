/* global jest expect */

const { Router } = require('./Router');
const pkg = require('../package.json');

let constructorArgs;

beforeEach(() => {
  constructorArgs = {
    logger: {
      fatal: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
      info: jest.fn(),
      debug: jest.fn(),
      trace: jest.fn(),
    },
    monitoring: {
      counters: 'test',
    },
    serviceDriver: {
      use: jest.fn(),
      get: jest.fn((path, ...args) => {
        constructorArgs.serviceDriver._cache.get[path] = args[args.length - 1];
      }),

      // simulate calling the endpoint
      _simulateCall(verb, path, req) {
        const resMock = {
          send: jest.fn(),
          json: jest.fn(),
        };
        constructorArgs.serviceDriver._cache[verb][path](req, resMock);
        return resMock;
      },
      _cache: { // keep the controllers for tests
        get: {},
        // post: {},
        // ... add
      },
    },
  };
});

describe('registerRoutes()', () => {
  test('should register', async () => {
    // prepare
    const router = new Router(constructorArgs);

    // run
    router.registerRoutes();

    // result
    expect(constructorArgs.serviceDriver.get).toHaveBeenCalledTimes(3);
    expect(constructorArgs.serviceDriver.get).toHaveBeenCalledWith('/', expect.any(Function));
    expect(constructorArgs.serviceDriver.get).toHaveBeenCalledWith('/health', expect.any(Function), expect.anything());
  });
});

describe('controller', () => {
  test('GET: / should return name and version', () => {
    // prepare
    const router = new Router(constructorArgs);
    router.registerRoutes();

    // run
    const resMock = constructorArgs.serviceDriver._simulateCall('get', '/', {});

    // result
    const expectedMatch = new RegExp(`${pkg.name}[\\s\\S]*${pkg.version}`);
    expect(resMock.send).toHaveBeenCalledWith(expect.stringMatching(expectedMatch));
  });

  test('GET: /health should return monitoring status', () => {
    // prepare
    const router = new Router(constructorArgs);
    router.registerRoutes();

    // run
    const resMock = constructorArgs.serviceDriver._simulateCall('get', '/health', {});

    // result
    expect(resMock.json).toHaveBeenCalledWith(expect.objectContaining({
      status: 'ok',
      monitoring: 'test',
    }));
  });

  test('GET: /health should handle error', () => {
    // prepare
    delete constructorArgs.monitoring.counters;
    Object.defineProperty(constructorArgs.monitoring, 'counters', {
      get: jest.fn(() => { throw new Error('testErr'); }),
    });

    const router = new Router(constructorArgs);
    router.registerRoutes();

    // run
    const resMock = constructorArgs.serviceDriver._simulateCall('get', '/health', {});

    // result
    expect(resMock.json).toHaveBeenCalledWith(expect.objectContaining({
      errorMessage: 'testErr',
    }));
  });
});
