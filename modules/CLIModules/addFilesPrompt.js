'use strict'
const path = require('path');
const prompt = require('../../node_modules/inquirer').createPromptModule();
const BuildFile = require('../../models/buildFileModel');

let questions = [
  {
    type: 'input',
    name: 'sourceFile',
    message: 'Source file. What is the file that has the all the imports?\n Input the file name, the directory is already provided',
    default: process.cwd()
  },
  {
    type: 'input',
    name: 'outputPath',
    message: '\n Output Path. Where should the build occur?\n Relative to your directory. E.g. "index.js", "../src/index.js" \n Default: ',
    default: process.cwd()
  },
  {
    type: 'input',
    name: 'outputName',
    message: '\n Output file name. Default: ',
    default: 'build.js'
  }
]

module.exports = (Callback) => {
  prompt([ questions[0], questions[1], questions[2] ]).then((answers) => {
    const source = path.join(process.cwd(), answers.sourceFile);
    const outputPath = answers.outputPath;
    const outputName = answers.outputName;
    const newBuildFile = new BuildFile(source, outputPath, outputName);

    Callback(newBuildFile);
  })
}
