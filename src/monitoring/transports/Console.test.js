/* global jest expect */

const { Console } = require('./Console');

jest.useFakeTimers();

let constructorArgs;

beforeEach(() => {
  constructorArgs = {
    config: {
      monitoring: {
        console: {
          interval: 123,
        },
      },
    },
    logger: {
      info: jest.fn(),
    },
    monitoring: {
      counters: 'test',
    },
  };
});

describe('start()', () => {
  test('should setInterval', () => {
    // prepare
    const cons = new Console(constructorArgs);

    // run
    cons.start();

    // result
    expect(setInterval).toHaveBeenCalledWith(expect.any(Function), 123);
  });

  test('should not setInterval if config not there', () => {
    // prepare
    constructorArgs.config.monitoring.console.interval = undefined;
    const cons = new Console(constructorArgs);

    // run
    cons.start();

    // result
    expect(setInterval).not.toHaveBeenCalled();
  });

  test('should log to logger.info', () => {
    // prepare
    const cons = new Console(constructorArgs);
    cons.start();

    // run
    jest.advanceTimersByTime(constructorArgs.config.monitoring.console.interval + 1);

    // result
    const consoleLog = expect.stringMatching(/Counters[\s\S]*test/);
    expect(constructorArgs.logger.info).toHaveBeenCalledWith(consoleLog);
  });
});

describe('stop()', () => {
  test('should clear interval', () => {
    // prepare
    const cons = new Console(constructorArgs);
    cons.start();

    // run
    cons.stop();

    // result
    expect(clearInterval).toHaveBeenCalled();
  });

  test('should allow calling stop without start', () => {
    // prepare
    const cons = new Console(constructorArgs);

    // run
    cons.stop();

    // result
    expect(clearInterval).not.toHaveBeenCalled();
  });
});
