'use strict'
const path = require('path');
const prompt = require('../../node_modules/inquirer').createPromptModule();
const sourceFile = require('../../models/sourceFileModel');

let questions = [
  {
    type: 'input',
    name: 'sourceFile',
    message: 'Source file. What is the file that has the all the imports?\n Input the file name, the directory is already provided: ',
    default: process.cwd()
  },
  {
    type: 'input',
    name: 'outputPath',
    message: '\n Output Path. Where should the build occur?\n Relative to your directory. E.g. "../", "../build", " " \n Current directory: ',
    default: process.cwd()
  },
  {
    type: 'input',
    name: 'outputName',
    message: '\n Output file name.\n Default: ',
    default: 'build.js'
  }
]

module.exports = (Callback) => {
  prompt([questions[0], questions[1], questions[2]]).then((answers) => {
    sourceFile.source = path.join(process.cwd(), answers.sourceFile);
    sourceFile.output.path = path.join(process.cwd(), answers.outputPath);
    sourceFile.output.name = answers.outputName;

    Callback(sourceFile);
  });
}
