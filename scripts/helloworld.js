//
// Script to add socketio to the project
// Usage:
//   - `$ npm run remove:helloworld`
//

const codeSnippetHelper = require('./helpers/codeSnippet');
const fs = require('fs');
const path = require('path');
const util = require('util');

const deleteFile = util.promisify(fs.unlink);

const scriptName = 'helloworld.js';
const files = [
  path.join(__dirname, '../src/Assembly.js'),
  path.join(__dirname, '../src/Monitoring.js'),
  path.join(__dirname, '../src/Router.js'),
  path.join(__dirname, '../test/integration/app.spec.js'),
];
const filesToRemove = [
  path.join(__dirname, '../src/helloworld/HelloWorld.js'),
];

async function run() {
  try {
    const argCommand = process.argv[2];

    switch (argCommand) {
      case 'remove': {
        await codeSnippetHelper.removeCode({ scriptName, files, enabledByDefault: true });
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
