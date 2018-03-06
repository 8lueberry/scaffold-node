/* global expect jest */

const { Monitoring } = require('./Monitoring');

jest.mock('./transports', () => ({
  Console: jest.fn().mockImplementation(() => ({
    start: jest.fn(),
    stop: jest.fn(),
  })),
}));

let constructorArgs;

beforeEach(() => {
  constructorArgs = {
    config: {},
    logger: {},
  };

  global.assembly = {
    logger: {},
    monitoring: {},
    config: {
      monitoring: {
        console: {},
      },
    },
  };
});

afterEach(() => {
  delete global.assembly;
});

describe('start()', () => {
  test('should not be allowed to call more than once', async () => {
    // prepare
    const monitoring = new Monitoring(constructorArgs);
    await monitoring.start();

    // run
    const run = () => monitoring.start();

    // result
    await expect(run()).rejects.toThrowError(/already started/);
  });
});

describe('stop()', () => {
  test('should call transport stop', async () => {
    // prepare
    const monitoring = new Monitoring(constructorArgs);
    await monitoring.start();

    // run
    await monitoring.stop();

    // result
    const transport = monitoring._transports[0];
    expect(transport.stop).toHaveBeenCalled();
  });
});

test('counters should contain date', () => {
  // prepare
  const monitoring = new Monitoring(constructorArgs);

  // run
  const result = monitoring.counters;

  // result
  expect(result).toHaveProperty('date', expect.any(Date));
});
