/* global expect */

const { AppError } = require('.'); // cheating to cover index

describe('Test suite for AppError', () => {
  describe('name', () => {
    it('should not update name when requested', () => {
      const result = new AppError({ updateName: false });
      expect(result.name).to.equal('Error');
    });

    it('should update name by default', () => {
      const result = new AppError();
      expect(result.name).to.equal('AppError');
    });
  });

  it('should extract code', () => {
    const result = new AppError({ code: 'ERR_TEST' });
    expect(result).to.have.property('code', 'ERR_TEST');
  });

  it('should extract innerError', () => {
    // prepare
    const testErr = new Error('testErr');

    // run
    const result = new AppError({ innerError: testErr });

    // result
    expect(result).to.have.property('innerError', testErr);
  });

  it('should allow any type of properties', () => {
    const result = new AppError({ details: 123 });
    expect(result).to.have.property('details', 123);
  });

  describe('toString', () => {
    function entry({ args, expectedResult }) {
      // prepare
      const err = new AppError(args);

      // run
      const result = err.toString();

      // result
      expect(result).to.equal(expectedResult);
    }

    it('should change the name', () => entry({
      args: {
      },
      expectedResult: 'AppError',
    }));

    it('should not change the name', () => entry({
      args: {
        updateName: false,
      },
      expectedResult: 'Error',
    }));

    it('should show message', () => entry({
      args: {
        message: 'testMessage',
      },
      expectedResult: 'AppError: testMessage',
    }));

    it('should show code', () => entry({
      args: {
        code: 'testCode',
      },
      expectedResult: 'AppError (code=testCode)',
    }));

    it('should show message, code and innerError', () => entry({
      args: {
        code: 'testCode',
        message: 'testMessage',
        innerError: new Error('testErr'),
      },
      expectedResult: 'AppError: testMessage (code=testCode). Error: testErr.',
    }));
  });

  describe('stack', () => {
    function entry({ args, expectedResult }) {
      // prepare
      const err = new AppError(args);

      // run
      const result = err.stack;

      // result
      expect(expectedResult.test(result)).to.be.true(`Expected ${expectedResult} to be true on \n${result}\n`);
    }

    it('should display normal stack', () => entry({
      args: {},
      expectedResult: /^AppError\n/,
    }));

    it('should include innerErr', () => entry({
      args: { innerError: new Error('innerErr') },
      expectedResult: /^AppError[\s\S]*\nError: innerErr\n/,
    }));
  });
});
