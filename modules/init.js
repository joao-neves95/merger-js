'use strict'
const dirname = require('path').dirname;
const prompt = require('../node_modules/inquirer').createPromptModule();
const userConfig = require('./userConfig');
const readDir = require('./utils').readDir;
const parseImports = require('./parseImports');
const writeConfigFile = require('./utils').writeJSONFile;
const notify = require('./notifications').notif;
const newTimestamp = require('./newTimestamp').small;
const finalInitMessage = 'Run "merger" or "merger build" to start building.';

// TODO: Add validation.
let questions = [
  {
    type: 'input',
    name: 'sourceFile',
    message: 'Source file. What is the file that has the all the imports?\n Default: ',
    default: process.cwd()
  },
  {
    type: 'input',
    name: 'buildOrder',
    message: '\n Build order. Press <enter> to confirm: ',
    default: ''
  },
  {
    type: 'input',
    name: 'outputPath',
    message: '\n Output Path. Where should the build occur?\n Default: ',
    default: ''
  },
  {
    type: 'input',
    name: 'outputName',
    message: '\n Output file name. Default: ',
    default: 'build.js'
  },
  {
    type: 'list',
    name: 'uglify',
    message: '\n Minify the JS output build file? ',
    choices: ['Yes', 'No'],
    default: 'Yes'
  },
  {
    type: 'list',
    name: 'auto',
    message: '\n Enable auto builds? ',
    choices: ['Yes', 'No'],
    default: 'No'
  },
];

module.exports = () => {
  prompt([questions[0]]).then((answer) => {
    let sourceFile = answer.sourceFile;
    // Source file.
    userConfig.source = sourceFile;
    // Default outputPath.
    questions[2].default = dirname(sourceFile) + '\\build';

    parseImports(sourceFile, (files) => {
      // Default build order:
      let fileLen = files.length
      for (let i = 0; i < fileLen; i++) {
        if (i === fileLen - 1)
          questions[1].default += '\n' + ' ' + files[i] + '\n';
        else
          questions[1].default += '\n' + ' ' + files[i] + ',';
      }
      prompt([questions[1], questions[2], questions[3], questions[4], questions[5]]).then((answers) => {
        let filesArr = answers.buildOrder.replace(/\s/g, '').split(',');
        // Build order:
        userConfig.buildOrder = filesArr;
        // Output file path:
        userConfig.output.path = answers.outputPath;
        // Output file name:
        userConfig.output.name = answers.outputName;
        // Minification:
        if (answers.uglify === 'No')
          userConfig.uglify = false;
        else
          userConfig.uglify = true;
        // Auto builds:
        if (answers.auto === 'Yes')
          userConfig.autoBuild = true;
        else
          userConfig.autoBuild = false;

        writeConfigFile(dirname(sourceFile), 'merger-config', userConfig, (err, data) => {
          if (err)
            return console.error(err);
          else {
            let timestamp = newTimestamp();
            notify('Init Successful.', `${timestamp}\n${finalInitMessage}`);
            console.info(`\n ${timestamp} - Init successful.\n`, data, `\n ${finalInitMessage}`);
          }
        });
      });
    });
  });
}
