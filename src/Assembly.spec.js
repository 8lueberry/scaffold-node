/* global expect fixtures loggerForTests */

const path = require('path');
const pkg = require('../package');
const proxyquire = require('proxyquire');
const configHelper = require('config');

describe('Test suite for Assembly', () => {
  let Assembly;
  let config;
  let initArgs;

  beforeEach(() => {
    config = fixtures.config.clone();
    config.util = configHelper.util;

    Assembly = proxyquire('./Assembly', {
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

  describe('config', () => {
    it('should load external config (dashboard consul config)', async () => {
      // prepare
      const assembly = new Assembly();

      // run
      async function run() {
        return assembly.init({
          externalConfigPath: path.resolve(__dirname, '../test/fixtures/config.console.json'),
        });
      }

      // result
      function test() {
        expect(assembly.config.test_extend).to.equal('test');
        expect(assembly.config.test_extend).to.equal('test');
      }

      await run();
      test();
    });

    it('should detect when external config doesn\'t exist', async () => {
      // prepare
      const assembly = new Assembly();

      // run
      const promise = assembly.init({
        externalConfigPath: '/this_path_should_not_exist/config.console.json',
      });

      // result
      expect(promise).to.eventually.not.be.rejected();
    });

    it('should merge the package.json into the configs', async () => {
      // prepare
      const assembly = new Assembly();

      const expectedConfig = JSON.parse(JSON.stringify(fixtures.pkg));

      delete expectedConfig.dependencies;
      delete expectedConfig.devDependencies;
      delete expectedConfig.scripts;

      // run
      async function run() {
        return assembly.init(initArgs);
      }

      // result
      function test() {
        expect(assembly.config.service).to.deep.include(expectedConfig);
      }

      await run();
      test();
    });

    it('should put the full service url in the configs based on the host property', async () => {
      // prepare
      const assembly = new Assembly();

      // run
      async function run() {
        return assembly.init(initArgs);
      }

      // result
      function test() {
        expect(assembly.config.service.url).to.deep.equal(`https://host/${pkg.yp.serviceGroup}/v1/test-service`);
      }

      await run();
      test();
    });

    it('should put the full service url in the configs based on yp/host', async () => {
      // prepare
      config.apigateway.host = '';
      const assembly = new Assembly();

      // run
      async function run() {
        return assembly.init(initArgs);
      }

      // result
      function test() {
        expect(assembly.config.service.url).to.deep.equal(`https://dev-ypapi.ypcloud.io/${pkg.yp.serviceGroup}/v1/test-service`);
      }

      await run();
      test();
    });
  });

  it('should clean', async () => {
    // prepare
    const assembly = new Assembly();
    async function prepare() {
      return assembly.init(initArgs);
    }

    // run
    function run() {
      assembly.clean();
    }

    // result
    function test() {
      // TODO: Add your clean tests here
    }

    await prepare();
    run();
    test();
  });

  it('should clean even when init is not called', async () => {
    // prepare
    const assembly = new Assembly();

    // run
    function run() {
      assembly.clean();
    }

    // result

    expect(() => run()).to.not.throw();
  });
});
