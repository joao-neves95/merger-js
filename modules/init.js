'use strict'
const prompt = require('../node_modules/inquirer').createPromptModule();
const userConfig = require('./userConfig');
const readDir = require('./utils').readDir;
const writeConfigFile = require('./utils').writeJSONFile;

// TODO: Add validation.
let questions = [
  {
    type: 'input',
    name: 'sourceDir',
    message: 'Source directory.\n Where are the source files located?\n Default: ',
    default: process.cwd()
  },
  {
    type: 'input',
    name: 'fileOrder',
    message: 'File order.\n In what order do you want the files to merge?\n Default: ',
    default: ''
  },
  {
    type: 'input',
    name: 'outputPath',
    message: 'Output Path.\n Where should the build occur?\n Default: ',
    default: ''
  },
  {
    type: 'input',
    name: 'outputName',
    message: 'Output file name:\n Default: ',
    default: 'build.js'
  },
  {
    type: 'list',
    name: 'uglify',
    message: 'Minify the JS output build file? ',
    choices: ['Yes', 'No'],
    default: 'Yes'
  },
  {
    type: 'list',
    name: 'auto',
    message: 'Enable auto builds? ',
    choices: ['Yes', 'No'],
    default: 'No'
  },
];

module.exports = () => {
  prompt([questions[0]]).then((answer) => {
    let userSource = answer.sourceDir;
    userConfig.source = userSource;
    questions[2].default = userConfig.source + '\\build';
    readDir(userSource, (err, files) => {
      if (err) return console.error(err);

      let fileLen = files.length
      for (let i = 0; i < fileLen; i++) {
        if (i === fileLen - 1)
          questions[1].default += files[i];
        else
          questions[1].default += files[i] + ', ';
      }
      prompt([questions[1], questions[2], questions[3], questions[4], questions[5]]).then((answers) => {
        let filesArr = answers.fileOrder.trim().split(', ');
        userConfig.fileOrder = filesArr;
        userConfig.output.path = answers.outputPath;
        userConfig.output.name = answers.outputName;
        if (answers.uglify === 'No')
          userConfig.uglify = false;
        else
          userConfig.uglify = true;
        if (answers.auto === 'Yes')
          userConfig.autoBuild = true;
        else
          userConfig.autoBuild = false;
        writeConfigFile(userConfig.source, 'merger-config', userConfig, (err, data) => {
          if (err)
            return console.error(err);
          else
            console.info('\nInit successful.\n', data, '\n');
        });
      });
    });
  });
}
