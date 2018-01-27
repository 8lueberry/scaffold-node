/**
 * Class extending Error that allows passing custom values to it.
 * The goal of this error is to display the stack with the inner error stacks.
 *
 * e.g.
 * throw new errors.AppError({
 *   ...
 *   message: 'This is a test error',
 *   innerError: new Error('You can pass any innerError and the stack should show this also'),
 * });
 *
 * console.error(..) will show
 *
 * AppError: This is a test error
 *   at HelloWorld.sayHello (/src/helloworld/HelloWorld.js:60:13)
 *   at Router.sayHelloController (/src/Router.js:191:42)
 *   at /src/Router.js:164:36
 *   at Layer.handle [as handle_request] (/node_modules/express/lib/router/layer.js:95:5)
 *   at next (/node_modules/express/lib/router/route.js:137:13)
 *   at Route.dispatch (/node_modules/express/lib/router/route.js:112:3)
 *   at Layer.handle [as handle_request] (/node_modules/express/lib/router/layer.js:95:5)
 *   at /node_modules/express/lib/router/index.js:281:22
 *   at Function.process_params (/node_modules/express/lib/router/index.js:335:12)
 *   at next (/node_modules/express/lib/router/index.js:275:10)
 * Error: You can pass any innerError and the stack should show this also
 *   at HelloWorld.sayHello (/src/helloworld/HelloWorld.js:64:21)
 *   at Router.sayHelloController (/src/Router.js:191:42)
 *   at /src/Router.js:164:36
 *   at Layer.handle [as handle_request] (/node_modules/express/lib/router/layer.js:95:5)
 *   at next (/node_modules/express/lib/router/route.js:137:13)
 *   at Route.dispatch (/node_modules/express/lib/router/route.js:112:3)
 *   at Layer.handle [as handle_request] (/node_modules/express/lib/router/layer.js:95:5)
 *   at /node_modules/express/lib/router/index.js:281:22
 *   at Function.process_params (/node_modules/express/lib/router/index.js:335:12)
 *   at next (/node_modules/express/lib/router/index.js:275:10)
 *
 * @class AppError
 * @extends {Error}
 */
class AppError extends Error {
  constructor({
    message, // error message
    code, // app error code (follow the same concept as https://nodejs.org/api/errors.html#errors_error_code)
    httpStatusCode = 500, // http response status code to return to the request
    details, // custom data: add any custom data you need here
    innerError, // innerError (the stack will be displayed in the current stack)
    updateName = true, // whether the error name should be updated
  } = {}) {
    super(message);

    if (updateName) {
      this.name = this.constructor.name;
    }

    this.code = code;
    this.httpStatusCode = httpStatusCode;
    this.details = details;
    this.innerError = innerError;

    this._initStack();
  }

  _initStack() {
    if (!this.innerError) {
      Error.captureStackTrace(this, this.constructor);
      return;
    }

    // build a temporary error to build a custom stack containing the innerErr stack
    const tempError = new Error(this.message);
    tempError.name = this.name;
    Error.captureStackTrace(tempError, this.constructor);
    this.stack = `${tempError.stack}\n${this.innerError.stack}`;
  }

  toString() {
    let result = super.toString();

    if (this.code) {
      result += ` (code=${this.code})`;
    }

    if (this.innerError) {
      result += `. ${this.innerError.toString()}.`;
    }

    return result;
  }
}

module.exports = {
  AppError,
};
