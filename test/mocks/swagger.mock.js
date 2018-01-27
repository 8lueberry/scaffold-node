/* global sinon */

class MiddlewareMock {
  constructor() {
    const middleware = sinon.stub();

    this.metadata = sinon.stub().returns(middleware);
    this.CORS = sinon.stub().returns(middleware);
    this.parseRequest = sinon.stub().returns(middleware);
    this.validateRequest = sinon.stub().returns(middleware);
  }
}

module.exports = {
  MiddlewareMock,
};
