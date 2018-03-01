const assert = require('assert');
const errors = require('./errors');
const { Assembly } = require('./Assembly');

const returnCodes = {
  OK: 0, // normal exit code
  SIGINT: 100, // SIGINT exit code (ctrl-c)
  UNCAUGHTEXCEPTION: 900, // system unexpected exception
  UNCAUGHTREJECTION: 901, // code error uncaughtrejection
};

class Bootstrapper {
  constructor() {
    this.assembly = new Assembly();
  }

  /**
   * Bootstraps the service
   */
  async bootstrap() {
    await this.assembly.init();
    await registerExitHandler.call(this);
    await startService.call(this);
    await startMonitoring.call(this);
  }
}

/**
 * Starts the service (express)
 */
async function startService() {
  const {
    config,
    router,
    logger,
    httpServer,
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
 */
async function startMonitoring() {
  const { monitoring } = this.assembly;
  assert(monitoring, 'expected monitoring');

  await monitoring.start();
}

/**
 * Attaches a handler for various exit conditions
 */
function registerExitHandler() {
  process.on('exit', code => exit.call(this, {
    code,
  }));

  process.on('SIGINT', () => exit({
    code: returnCodes.SIGINT,
    message: '\nGot SIGINT (ctrl-c) signal',
    clean: true,
  }));

  process.on('unhandledRejection', err => exit.call(this, {
    code: returnCodes.UNCAUGHTREJECTION,
    error: new errors.AppError({
      message: 'Unexpected error (uncaught rejection). Make sure all your promise chain are caught.',
      innerError: err,
    }),
  }));

  process.on('uncaughtException', err => exit.call(this, {
    code: returnCodes.UNCAUGHTEXCEPTION,
    error: new errors.AppError({
      message: 'Unexpected error (uncaught exception)',
      innerError: err,
    }),
  }));
}

/**
 * Exits
 */
function exit({
  code,
  message,
  error,
  clean,
} = {}) {
  const { logger } = this.assembly;
  assert(logger, 'expected logger');

  if (clean && this._isCleaning) {
    return;
  }

  if (message) {
    if (message.startsWith('\n')) {
      process.stdout.write('\n');
    }

    logger.info(message.trim('\n'));
  }

  if (error) {
    logger.error({
      message: 'Exit with error',
      error,
    });
  }

  if (clean) {
    cleanAndExit.call(this, { code });
    return;
  }

  const codeInfo = Object.entries(returnCodes).find(kv => kv[1] === code);
  logger.info(`Exit with code ${code} (${codeInfo ? codeInfo[0] : 'unknown code'})\n`);
  process.exit(code);
}

/**
 * Cleanup and exit
 */
function cleanAndExit({
  code,
}) {
  const { logger } = this.assembly;
  assert(logger, 'expected logger');

  logger.info('Starting cleanup before exit');
  this._isCleaning = true;

  cleanForceExit.call(this, { code, inSeconds: 3 });
}

function cleanForceExit({ code, inSeconds }) {
  const { logger } = this.assembly;
  assert(logger, 'expected logger');

  let countDown = inSeconds;
  setInterval(() => {
    countDown -= 1;
    process.stdout.write(`\rWaiting for cleanup: ${countDown}s`);
    if (countDown <= 0) {
      process.stdout.write('\r');
      logger.info(`Waiting for cleanup: timeout (forced quit after ${inSeconds}s)`);
      process.exit(code);
    }
  }, 1000);
}

module.exports = {
  Bootstrapper,
  returnCodes,
};
