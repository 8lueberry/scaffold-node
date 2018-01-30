const { Assembly } = require('./Assembly');

jest.mock('./helloworld/HelloWorld');

describe('Test suite for Assembly', () => {
  test.only('should initialize', async () => {
    // prepare
    const assembly = new Assembly();

    // run
    await assembly.init();

    // result
    expect(assembly.assembly).toBeDefined();
    expect(assembly.logger).toBeDefined();
    expect(assembly.config).toBeDefined();
    expect(assembly.serviceDriver).toBeDefined();
    expect(assembly.httpServer).toBeDefined();
    expect(assembly.socketDriver).toBeDefined();
    expect(assembly.connections).toBeDefined();
    expect(assembly.monitoring).toBeDefined();
    expect(assembly.router).toBeDefined();
    expect(assembly.helloworld).toBeDefined();

    expect(global.assembly).toEqual(assembly);
  });
});
