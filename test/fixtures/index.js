const config = require('config');
const fs = require('fs');
const JSON5 = require('json5');
const path = require('path');
const pkg = require('./package.fixture');

function parseJSON5(filepath) {
  const fullPath = path.join(__dirname, filepath);
  const configStr = fs.readFileSync(fullPath, 'utf8');
  const configTest = JSON5.parse(configStr);

  configTest.util = config.util;
  configTest.has = config.has;
  configTest.get = config.get;
  configTest.clone = () => JSON.parse(JSON.stringify(configTest));

  return configTest;
}

module.exports = {
  config: parseJSON5('../../config/test.json5'),
  pkg,
};
