/* global jest expect */

const express = require('express');
const http = require('http');
const { Assembly } = require('./Assembly');
const { Monitoring } = require('./monitoring');

jest.mock('config', () => ({
  test: 'config',
}));

jest.mock('express', () => jest.fn().mockReturnValue({
  test: 'express',
}));

jest.mock('http', () => ({
  Server: jest.fn().mockReturnValue({
    test: 'httpServer',
  }),
}));

jest.mock('./Logger', () => jest.fn().mockReturnValue({
  test: 'logger',
}));

jest.mock('./monitoring', () => ({
  Monitoring: jest.fn().mockImplementation(() => ({
    test: 'monitoring',
  })),
}));

describe('init()', () => {
  async function entry({ result }) {
    // prepare
    const assembly = new Assembly();

    // run
    await assembly.init();

    // result
    result(assembly);
  }

  test('should contain config', async () => entry({
    result(assembly) {
      expect(assembly.config).toEqual({ test: 'config' });
    },
  }));

  test('should contain logger', async () => entry({
    result(assembly) {
      // expect(logger).toBeCalled();
      expect(assembly.logger).toEqual({ test: 'logger' });
    },
  }));

  test('should contain serviceDriver', async () => entry({
    result(assembly) {
      expect(express).toBeCalled();
      expect(assembly.serviceDriver).toEqual({ test: 'express' });
    },
  }));

  test('should contain httpServer', async () => entry({
    result(assembly) {
      expect(http.Server).toBeCalled();
      expect(assembly.httpServer).toEqual({ test: 'httpServer' });
    },
  }));

  test('should contain monitoring', async () => entry({
    result(assembly) {
      expect(Monitoring).toBeCalled();
      expect(assembly.monitoring).toEqual({ test: 'monitoring' });
    },
  }));
});
