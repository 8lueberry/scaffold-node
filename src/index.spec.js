/* global loggerForTests sinon expect */
const proxyquire = require('proxyquire');
const { EventEmitter } = require('events');

describe('Test suite for index', () => {
  let AssemblyMock;
  let routerMock;
  let monitoringMock;
  let httpServerMock;

  beforeEach(() => {
    routerMock = {
      registerRoutes: sinon.stub(),
    };

    monitoringMock = new EventEmitter();
    monitoringMock.start = sinon.stub();

    httpServerMock = {
      listen: sinon.stub().callsArg(1),
    };

    AssemblyMock = {
      Assembly: class {
        constructor() {
          this.init = sinon.stub();
          this.clean = sinon.stub();
          this.logger = loggerForTests;
          this.router = routerMock;
          this.monitoring = monitoringMock;
          this.httpServer = httpServerMock;
        }
      },
    };
  });

  it('should start the app', async () => {
    // run
    async function run() {
      await proxyquire('./index', {
        './Assembly': AssemblyMock,
      });
    }

    // result
    function test() {
      expect(routerMock.registerRoutes).to.have.been.called();
      expect(httpServerMock.listen).to.have.been.called();
      expect(monitoringMock.start).to.have.been.called();
    }

    await run();
    test();
  });
});
