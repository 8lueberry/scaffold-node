//
// Script to add socketio to the project
// Usage:
//   - `$ npm run add:socketio`
//   - `$ npm run remove:socketio`
//

const codeSnippetHelper = require('./helpers/codeSnippet');
const path = require('path');

const scriptName = 'socketio.js';
const files = [
  path.join(__dirname, '../src/Assembly.js'),
  path.join(__dirname, '../src/Router.js')
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
