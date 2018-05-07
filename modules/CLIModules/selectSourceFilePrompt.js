'use strict'
const path = require('path');
const prompt = require('../../node_modules/inquirer').createPromptModule();
const readDir = require('../utils').readDir;
const style = require('../consoleStyling');

const question = [
  {
    type: 'list',
    name: 'sourceFile',
    message: '\n Select a source file: ',
    choices: []
  }
]

// It returns the chosen source file object from the merger-config.
module.exports = (Callback) => {
  // All the source file objects from the user's merger-config.json file.
  const sourceFiles = global.config.sourceFiles

  if (!sourceFiles)
    return console.error(style.styledError, style.errorText('There is no "sourceFiles" property on the merger-config file.'), '\nPlease run "merger init".');
  else if (sourceFiles.length <= 0)
    return console.error(style.styledError, style.errorText('There are no source files on the merger-config file.'), '\nPlease run "merger add" to add a file.');
  else if (sourceFiles.length === 1)
    return Callback(sourceFiles[0]);

  for (let i = 0; i < sourceFiles.length; i++) {
    question[0].choices.push(path.basename(sourceFiles[i].source));
  }

  prompt([question[0]]).then((answer) => {
    // The chosen source file.
    let sourceFile = null;

    for (let i = 0; i < sourceFiles.length; i++) {
      if (path.basename(sourceFiles[i].source) === answer.sourceFile) {
        sourceFile = sourceFiles[i];
        break;
      }
    }

    if (!sourceFile)
      return console.error(style.styledError, style.errorText('Source file not found.'));
    Callback(sourceFile);
  });
}
