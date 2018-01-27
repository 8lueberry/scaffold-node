const replace = require('replace-in-file');

async function addCode({ scriptName, files }) {
  console.log(`Adding code for ${scriptName}: ${files.join(', ')}`);

  const fromRegex = new RegExp(`\\n\\s*(\\/\\*)?\\s*scripts\\/${scriptName}\\s*(\\*\\/)?\n`);
  await replace({
    files,
    from: fromRegex,
    to: '\n',
  });
  console.log('Adding code... done');
}

async function removeCode({ scriptName, files, enabledByDefault = false }) {
  console.log(`Cleaning code '${scriptName}' in ${files.join(', ')}`);

  const fromRegex = new RegExp(`\\n*\\s*\\/\\*\\s*scripts\\/${scriptName}\\s*${enabledByDefault ? '\\*\\/[\\s\\S]*?\\/\\*' : '[\\s\\S]*?'}\\s*scripts\\/${scriptName}\\s*\\*\\/`, 'g');

  await replace({
    files,
    from: fromRegex,
    to: '',
  });
  console.log('Cleaning code... done');
}

module.exports = {
  addCode,
  removeCode,
};
