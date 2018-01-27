/* global loggerForTests wait expect fixtures sinon */
const { Monitoring } = require('./Monitoring');

describe('Test suite for Monitoring', () => {
  let monitoringArgs;
  let config;

  beforeEach(() => {
    config = fixtures.config.clone();

    monitoringArgs = {
      config,
      logger: loggerForTests,
    };
  });

  it('should create default monitoring counters', () => {
    // prepare
    const monitoring = new Monitoring(monitoringArgs);

    // run
    const result = monitoring.getCurrentCounters();

    // result
    expect(result).to.exist();
  });

  describe('console', () => {
    describe('start', () => {
      async function entry({ prepare, test }) {
        // prepare
        prepare();
        monitoringArgs.logger = {
          info: sinon.stub(),
        };
        const monitoring = new Monitoring(monitoringArgs);

        // run
        await monitoring.start();
        await wait(1);

        // result
        test();
      }

      it('should start the console monitoring', async () => entry({
        prepare() {
          config.monitoring = {
            console: {
              interval: 1,
            },
          };
        },
        test() {
          expect(monitoringArgs.logger.info).to.have.been.called();
        },
      }));

      it('should not start the console monitoring when no config', async () => entry({
        prepare() {
          config.monitoring = {
          };
        },
        test() {
          expect(monitoringArgs.logger.info).not.to.have.been.called();
        },
      }));

      it('should not start the console monitoring when interval is 0', async () => entry({
        prepare() {
          config.monitoring = {
            console: {
              interval: 0,
            },
          };
        },
        test() {
          expect(monitoringArgs.logger.info).not.to.have.been.called();
        },
      }));
    });

    it('should stop', async () => {
      // prepare
      config.monitoring = {
        console: {
          interval: 1,
        },
      };
      monitoringArgs.logger = {
        info: sinon.stub(),
      };
      const monitoring = new Monitoring(monitoringArgs);
      await monitoring.start();
      await wait(1);
      expect(monitoringArgs.logger.info).to.have.been.called();

      // run
      await monitoring.stop();
      await wait(1);
      const callCount = monitoringArgs.logger.info.callCount;
      await wait(5);

      // result
      expect(monitoringArgs.logger.info.callCount).to.equal(callCount);
    });

    it('should allow 2 times stop', async () => {
      // prepare
      config.monitoring = {
        console: {
          interval: 1,
        },
      };
      monitoringArgs.logger = {
        info: sinon.stub(),
      };
      const monitoring = new Monitoring(monitoringArgs);
      await monitoring.start();

      // run
      await monitoring.stop();
      await monitoring.stop();

      // result
      // no throw then ok
    });
  });
});
