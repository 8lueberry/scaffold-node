//
// Script to add socketio to the project
// Usage:
//   - `$ npm run add:newrelic`
//   - `$ npm run remove:newrelic`
//

const codeSnippetHelper = require('./helpers/codeSnippet');
const fs = require('fs');
const path = require('path');
const util = require('util');

const deleteFile = util.promisify(fs.unlink);

const scriptName = 'newrelic.js';
const files = [
  path.join(__dirname, '../src/Assembly.js'),
  path.join(__dirname, '../src/Router.js'),
  path.join(__dirname, '../.drone.yml'),
];
const filesToRemove = [
  path.join(__dirname, '../newrelic.js'),
];

async function run() {
  try {
    const argCommand = process.argv[2];

    switch (argCommand) {
      case 'add': {
        await codeSnippetHelper.addCode({ scriptName, files });
        break;
      }
      case 'remove': {
        await codeSnippetHelper.removeCode({ scriptName, files });
        await Promise.all(filesToRemove.map(f => deleteFile(f)));
        break;
      }
      default:
        console.error(`Unknown command ${argCommand}`);
        break;
    }
  } catch (err) {
    console.error('Error while running', err);
  }
}

run();
