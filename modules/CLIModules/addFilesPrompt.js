'use strict'
const path = require('path');
const prompt = require('../../node_modules/inquirer').createPromptModule();
const sourceFile = require('../../models/sourceFileModel');

let questions = [
  {
    type: 'input',
    name: 'sourceFile',
    message: 'Source file. What is the file that has the all the imports?\n Input the file name, or a relative path.\n The directory is already provided: ',
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
];

module.exports = ( Callback ) => {
  prompt( [questions[0], questions[1], questions[2]] ).then( ( answers ) => {
    let source = answers.sourceFile;
    if ( path.extname( source ) === '' )
      source += '.js';

    sourceFile.source = path.join( process.cwd(), source );
    sourceFile.output.path = path.join( process.cwd(), answers.outputPath );

    let outputName = answers.outputName;
    if ( path.extname( outputName ) === '' )
      outputName += '.js';

    sourceFile.output.name = outputName;

    Callback( sourceFile );
  } );
};
