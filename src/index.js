const { Bootstrapper, returnCodes } = require('./Bootstrapper');

async function run() {
  let bootstrapper;

  try {
    bootstrapper = new Bootstrapper();
    await bootstrapper.bootstrap();
  } catch (err) /* istanbul ignore next: hard to test process.exit */ {
    console.error('Unexpected error during initialization', err); // eslint-disable-line no-console
    process.exit(returnCodes.UNCAUGHTEXCEPTION);
  }

  return bootstrapper;
}

module.exports = run();
