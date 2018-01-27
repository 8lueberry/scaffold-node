/**
 * Application entry point
 */

const assert = require('assert');

const { Assembly } = require('./Assembly');

const returnCodes = {
  OK: 0, // normal exit code
  SIGINT: 2, // SIGINT exit code (ctrl-c)
  UNEXPECTEDSTOP: 3, // when the sys stops unexpectedly
  UNCAUGHTEXCEPTION: 99, // system unexpected exception exit
};

class Main {
  constructor() {
    this.assembly = new Assembly();
  }

  /**
   * Initialize the assembly dependency
   *
   * @returns {Promise} - An empty promise but with the assembly filled
   *
   * @memberOf Main
   */
  async initDependencies() {
    await this.assembly.init();
  }

  /**
   * Starts the service (express)
   *
   * @memberOf Main
   */
  async startService() {
    const {
      config, router, logger, httpServer,
    } = this.assembly;

    assert(router, 'expected router');
    assert(logger, 'expected logger');
    assert(httpServer, 'expected httpServer');
    assert(config && config.server && config.server.port, 'expected config.server.port value');

    const serverPort = config.server.port;

    await router.registerRoutes();
    await new Promise(resolve => httpServer.listen(serverPort, () => resolve()));
    logger.info(`Service running on http://localhost:${serverPort}`);
  }

  /**
   * Starts the monitoring
   *
   * @returns
   *
   * @memberof Main
   */
  async startMonitoring() {
    const { monitoring, logger } = this.assembly;
    assert(logger, 'expected logger');

    await monitoring.start();
  }

  /**
   * Handles various exit cases
   * @param code - The exit code to exit with (if exit=true)
   * @param exit - Whether the process should exit
   */
  /* istanbul ignore next: hard to test process.exit */
  async exit({ code, exit, err }) {
    if (err) {
      console.error(`Exit (${code}) with error`, err); // eslint-disable-line no-console
    }

    if (exit) {
      const { monitoring } = this.assembly;
      await monitoring.stop();

      process.exit(code);
    }
  }

  /**
   * Attaches a handler for various exit conditions
   */
  /* istanbul ignore next: hard to test process.exit */
  registerExitHandler() {
    process.on('exit', () => this.exit({
      exit: false,
      code: returnCodes.OK,
    }));
    process.on('SIGINT', () => this.exit({
      exit: true,
      code: returnCodes.SIGINT,
    }));
    process.on('uncaughtException', err => this.exit({
      err,
      exit: true,
      code: returnCodes.UNCAUGHTEXCEPTION,
    }));
  }
}

async function run() {
  const main = new Main();

  try {
    await main.registerExitHandler();
    await main.initDependencies();
    await main.startService();
    await main.startMonitoring();
  } catch (err) /* istanbul ignore next: hard to test process.exit */ {
    console.error('Unexpected error during initialization', err); // eslint-disable-line no-console
    main.exit({
      code: returnCodes.UNCAUGHTEXCEPTION,
      exit: true,
    });
  }

  return main;
}

module.exports = run();
