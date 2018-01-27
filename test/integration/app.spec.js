/* global expect chai */
/* estlint-disable no-unused-expressions */

const pkg = require('../../package.json');

describe('App', () => {
  const servicePath = `http://127.0.0.1:${pkg.yp.port}`;
  let main;

  before(async () => {
    // NOTE: Integration testing should NEVER rely on external services.
    // You should either mock them or provide them in the CICD pipeline.

    // This is were you do you configuration override.
    //
    // First, you need to import the config module,
    // then you can modify the config like in the following example.
    //
    // ex:
    // config.services = {
    //   url: 'http://fake:9999',
    // };

    main = await require('../../src/index'); // eslint-disable-line global-require
  });

  after((done) => {
    const { httpServer } = main.assembly;
    httpServer.close(done);
  });

  // Here you can add describe blocks for each of the routes

  /* scripts/helloworld.js */
  describe('GET /helloworld', () => {
    it('should return 200', async () => {
      // run
      const res = await chai.request(servicePath).get('/helloworld');

      // result
      expect(res.statusCode).to.equal(200);
    });

    it('should put the result flag to true in the response', async () => {
      // run
      const res = await chai.request(servicePath).get('/helloworld');

      // result
      expect(res.body.result).to.be.true();
    });

    it('should put "Hello" and the name parameter in the body', async () => {
      // run
      const res = await chai.request(servicePath).get('/helloworld?name=You');

      // result
      expect(res.body.data).to.be.equal('Hello You');
    });
  });
  /* scripts/helloworld.js */

  describe('GET /health', () => {
    it('should return cors header', async () => {
      const res = await chai.request(servicePath).get('/health');

      expect(res.header['access-control-allow-origin']).to.be.equal('*');
    });
  });
});
