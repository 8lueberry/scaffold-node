/* global expect */

const { AppError } = require('./AppError');

test('should show innerError stack', () => {
  // prepare
  const appError = new AppError({
    innerError: new Error('testErr'),
  });

  // run
  const result = appError.stack;

  // result
  expect(result).toMatch(/AppError\n[\s]*at[\s\S]*Error: testErr\n[\s]*at/);
});

describe('toString()', () => {
  function entry({ args, expectedResult }) {
    // prepare
    const appError = new AppError(args);

    // run
    const result = appError.toString();

    // result
    expect(result).toMatch(expectedResult);
  }

  test('should show innerError message', () => entry({
    args: {
      message: 'testErr1',
      innerError: new Error('testErr2'),
    },
    expectedResult: /AppError: testErr1[\s\S]*Error: testErr2/,
  }));

  test('should show code', () => entry({
    args: {
      message: 'testErr',
      code: 123,
    },
    expectedResult: /AppError: testErr \(code=123\)/,
  }));
});

test('should use default values', () => {
  // run
  const appError = new AppError();

  // result
  expect(appError).toHaveProperty('httpStatusCode', 500);
});
