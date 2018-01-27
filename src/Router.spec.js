/* global loggerForTests wait sinon expect mocks fixtures */

const errors = require('./errors');
const pkg = require('../package.json');
const proxyquire = require('proxyquire');

describe('Test suite for Router', () => {
  let Router;
  let routerArgs;

  beforeEach(() => {
    const monitoringMock = {
      getCurrentCounters: sinon.stub().returns({ counters: 'test' }),
    };

    routerArgs = {
      logger: loggerForTests,
      config: fixtures.config,
      monitoring: monitoringMock,
      serviceDriver: new mocks.express.AppMock(),
      socketDriver: { on: sinon.stub() },
    };

    Router = proxyquire('./Router', { // eslint-disable-line
      ypcloud: sinon.stub().returns(() => {}),
    }).Router;
  });

  it('should register endpoints', () => {
    // prepare
    const router = new Router(routerArgs);

    // run
    function run() {
      router.registerRoutes();
    }

    // result
    function test() {
      expect(routerArgs.serviceDriver.get).to.have.been.calledWith('/');
      expect(routerArgs.serviceDriver.get).to.have.been.calledWith('/health');
      // expect(routerArgs.serviceDriver.get).to.have.been.calledWith('/helloworld');
    }

    run();
    test();
  });

  describe('controller', () => {
    let reqMock;
    let resMock;

    beforeEach(() => {
      reqMock = new mocks.express.RequestMock();
      resMock = new mocks.express.ResponseMock();
    });

    async function entry({ method, endpoint, test }) {
      // prepare
      const router = new Router(routerArgs);
      function prepare() {
        router.registerRoutes();
      }

      // run
      function run() {
        routerArgs.serviceDriver.simulateCall(method, endpoint, reqMock, resMock);
      }

      // result

      prepare();
      run();
      await wait();
      test();
    }

    it('should call homeController', async () => entry({
      method: 'get',
      endpoint: '/',
      test: () => {
        expect(resMock.send).to.have.been.calledWith(`<html><body>${pkg.name} v${pkg.version}</body></html>`);
      },
    }));

    it('should call healthController', async () => entry({
      method: 'get',
      endpoint: '/health',
      test: () => {
        expect(resMock.json).to.have.been.calledWith({ status: 200, monitoring: { counters: 'test' } });
      },
    }));
  });

  describe('handleErrors', () => {
    it('should handle error', async () => {
      // prepare
      const router = new Router(routerArgs);
      const testErr = new errors.AppError({
        code: 'testErrCode',
        message: 'testErr',
      });
      const reqMock = new mocks.express.RequestMock();
      const resMock = new mocks.express.ResponseMock();

      // run
      function run() {
        const runner = router.handleErrors(() => { throw testErr; });
        return runner(reqMock, resMock);
      }

      // result
      function test() {
        expect(resMock.json).to.have.been.calledWith({
          errors: {
            codes: ['testErrCode'],
          },
        });
      }

      await run();
      test();
    });
  });
});
