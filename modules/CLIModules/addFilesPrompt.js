/*
 * Copyright (c) 2018-2020 João Pedro Martins Neves - All Rights Reserved.
 *
 * MergerJS (merger-js) is licensed under the MIT license, located in
 * the root of this project, under the name "LICENSE.md".
 *
 */

'use strict'
const path = require('path');
const prompt = require('../../node_modules/inquirer').createPromptModule();
const { readDir } = require( '../utils' );
const SourceFile = require( '../../models/sourceFileModel' );
const DEFAULT_BUILD_FILE_NAME = 'build.js';

let questions = [
  {
    type: 'list',
    name: 'sourceFileSelect',
    message: 'Source file. Select the file with the imports or select "CUSTOM FILE" to input a custom file.',
    choices: ['>> CUSTOM FILE <<'],
    default: process.cwd()
  },
  {
    type: 'input',
    name: 'customSourceFile',
    message: '\n Input the file name, or a relative path to the curent directory.\n The current directory is already provided: ',
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
    default: DEFAULT_BUILD_FILE_NAME
  }
];

module.exports = async ( Callback ) => {
  const currentDir = process.cwd();
  /** @type { string[] } */
  const allFilesFromCurrentDir = await readDir( currentDir );

  for ( let i = 0; i < allFilesFromCurrentDir.length; ++i ) {
    if ( path.extname( allFilesFromCurrentDir[i] ) !== '' ) {
      questions[0].choices.push( allFilesFromCurrentDir[i] );
    }
  }

  const sourceFile = new SourceFile();
  let answers = await prompt( [questions[0]] );

  // SELECTED FILE
  if ( answers.sourceFileSelect !== '>> CUSTOM FILE <<' ) {
    sourceFile.source = path.join( currentDir, answers.sourceFileSelect );

  // CUSTOM FILE PATH
  } else {
    answers = await prompt( [questions[1]] );

    sourceFile.source = answers.customSourceFile;
    if ( path.extname( sourceFile.source ) === '' ) {
      sourceFile.source += '.js';
    }

    sourceFile.source = path.join( currentDir, sourceFile.source );
  }

  answers = await prompt( [questions[2], questions[3]] );

  sourceFile.output.path = path.join( currentDir, answers.outputPath );
  sourceFile.output.name = answers.outputName;

  if ( sourceFile.output.name === '' ) {
    sourceFile.output.name = DEFAULT_BUILD_FILE_NAME;

  } else if ( path.extname( sourceFile.output.name ) === '' ) {
    sourceFile.output.name += '.js';
  }

  return Callback( sourceFile );
};
