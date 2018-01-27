/* global expect fixtures loggerForTests */

const proxyquire = require('proxyquire');
const configHelper = require('config');

describe('Test suite for Assembly', () => {
  let Assembly;
  let config;
  let initArgs;

  beforeEach(() => {
    config = fixtures.config.clone();
    config.util = configHelper.util;

    Assembly = proxyquire('./Assembly', { // eslint-disable-line
      '../package.json': fixtures.pkg,
      'yp-logger': loggerForTests,
      config,
    }).Assembly;

    initArgs = {
      externalConfigPath: '',
    };
  });

  describe('initialization', () => {
    it('should initialize components', async () => {
      // prepare
      const assembly = new Assembly();

      // run
      async function run() {
        return assembly.init(initArgs);
      }

      // result
      function test() {
        expect(assembly.logger).to.exist();
        expect(assembly.config).to.exist();
        expect(assembly.serviceDriver).to.exist();
        expect(assembly.monitoring).to.exist();
        expect(assembly.router).to.exist();
      }

      await run();
      test();
    });
  });
});
