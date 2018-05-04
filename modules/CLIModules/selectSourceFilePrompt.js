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

module.exports = (Callback) => {
  const sourceFiles = global.config.sourceFiles
  for (let i = 0; i < sourceFiles.length; i++) {
    question[0].choices.push(path.basename(sourceFiles[i].source));
  }

  prompt([ question[0] ]).then((answer) => {
    const sourceFiles = global.config.sourceFiles;
    // SourceFile instance object (sourceFileModel.js).
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
