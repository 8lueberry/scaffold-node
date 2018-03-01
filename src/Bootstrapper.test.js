/* global jest expect */

const { Bootstrapper } = require('./Bootstrapper');
const { mocks: assemblyMocks } = require('./Assembly');

jest.mock('./Assembly');

describe('bootstrap', () => {
  test('should start service', async () => {
    // prepare
    const bootstrapper = new Bootstrapper();

    // run
    await bootstrapper.bootstrap();

    // result
    expect(assemblyMocks.httpServer.listen).toHaveBeenCalledTimes(1);
  });

  test('should start monitoring', async () => {
    // prepare
    const bootstrapper = new Bootstrapper();

    // run
    await bootstrapper.bootstrap();

    // result
    expect(assemblyMocks.monitoring.start).toHaveBeenCalledTimes(1);
  });
});
