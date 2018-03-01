const winston = require('winston');

const levels = {
  fatal: 0,
  error: 1,
  warn: 2,
  info: 3,
  debug: 4,
  trace: 5,
};

function logger() {
  const result = winston.createLogger({
    transports: [
      consoleTransport(),
    ],
  });

  return result;
}

const myFormat = {
  // adds error info to the log
  error: winston.format((i) => {
    const result = i;
    result.error = '';

    const err = i.err || i.error;
    if (err) {
      if (!i.message) {
        result.message = err.toString();
      }
      result.error = `\n\nError info\n----------\n${err.toString()}\n\nStack trace\n-----------\n\u001b[31m${err.stack}\u001b[39m\n\n`;
    }

    return result;
  }),
};

function consoleTransport() {
  const colors = {
    fatal: 'red',
    error: 'red',
    warn: 'yellow',
    info: 'green',
    debug: 'blue',
    trace: 'yellow',
  };

  return new winston.transports.Console({
    levels,
    format: winston.format.combine(
      myFormat.error(),
      winston.format.colorize({ colors }),
      winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      winston.format.printf(i => `${i.level} \u001b[36m${i.timestamp}\u001b[39m ${i.message} ${i.error}`),
    ),
  });
}

module.exports = logger;
