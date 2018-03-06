const assert = require('assert');
const { HelloError } = require('./HelloError');
const { EventEmitter } = require('events');

/* istanbul ignore next */
class HelloWorld extends EventEmitter {
  /**
   * If you create your instance in the Assembly, you can use Object destructuring to get
   * your dependencies injected here.
   */
  constructor({
    // NOTE: If you need any dependencies (built by Assembly), you just have to add it to the
    // constructor and it will be automatically injected using object deconstructing.
    logger,
    config, // eslint-disable-line no-unused-vars
  }) {
    super(); // EventEmitter

    assert(logger, 'expected logger');
    assert(config, 'expected config');

    this._logger = logger;
    this._greetings = config.helloworld ? config.helloworld.greetings : null || 'Hello';

    // NOTE: if you need to create internal new objects, you have reference of the assembly
    // this._myNewObject(global.assembly);
  }

  sayHello({
    // NOTE: The name param is actually passed by destructuring req.query (Router.js)
    name = 'World',
  }) {
    this._logger.debug('sayHello called');

    // Monitoring.js wants to monitor every time this is called
    // Instead of passing monitoring to this class (high coupling), this class can emit events
    // This class should not know anything about the monitoring (or other instances)
    // It makes it easier to add/remove/refactor the listeners without code changes here
    this.emit('call', name);

    // example of throwing an error
    // http://localhost:8008/helloworld?name=error
    if (name === 'error') {
      throw new HelloError({
        innerError: new Error('You passed error as name'),
      });
    }

    // -> Hello World
    return `${this._greetings} ${name}`;
  }
}

module.exports = {
  HelloWorld,
};
