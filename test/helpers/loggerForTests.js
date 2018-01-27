//
// Logger for tests
//

const loggerForTests = {
  log: () => {},
  debug: () => {},
  info: () => {},
  trace: () => {},
  warn: () => {},
  warning: () => {},
  error: () => {},
  context: () => loggerForTests,
};

global.loggerForTests = loggerForTests;
