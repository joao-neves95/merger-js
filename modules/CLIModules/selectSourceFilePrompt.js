'use strict'
const path = require('path');
const prompt = require('../../node_modules/inquirer').createPromptModule();
const readDir = require('../utils').readDir;
const findFile = require('../findFileOrDir');
const style = require('../consoleStyling');

const question = [
  {
    type: 'list',
    name: 'sourceFile',
    message: '\n Select a source file: ',
    choices: []
  }
];

/**
 * Prompts the user to select a source file, or all of them, from its merger-config.json file.
 * Returns the chosen sourceFileModel || sourceFileModel[].
 * 
 * @param { Function } Callback A callback that receives a sourceFileModel object or array, depending on the user's choice.
 * @returns { sourceFileModel | sourceFileModel[] }
 */
module.exports = ( Callback ) => {

  findFile( 'merger-config.json', ( configFilePath ) => {
    // All the source file objects (sourceFileModel[]) from the user's merger-config.json file. No need for a try-catch because it was already done in config.js.
    const CONFIG = require( configFilePath );
    const sourceFiles = CONFIG.sourceFiles;

    if ( !sourceFiles )
      return console.error( style.styledError, style.errorText( 'There is no "sourceFiles" property on the merger-config file.' ), '\nPlease run "merger init".' );
    else if ( sourceFiles.length <= 0 )
      return console.error( style.styledError, style.errorText( 'There are no source files on the merger-config file.' ), '\nPlease run "merger add" to add a file.' );
    else if ( sourceFiles.length === 1 )
      return Callback( sourceFiles[0] );

    for ( let i = 0; i < sourceFiles.length; ++i ) {
      question[0].choices.push( path.relative( configFilePath, sourceFiles[i].source ) );
    }
    question[0].choices.push( 'All' );

    prompt( [question[0]] ).then( ( answer ) => {
      // The chosen source file.
      /** @type { sourceFileModel | sourceFileModel[] } */
      let sourceFile = null;

      if ( answer.sourceFile === 'All' )
        sourceFile = sourceFiles;
      else {
        for ( let i = 0; i < sourceFiles.length; ++i ) {
          if ( path.relative( configFilePath, sourceFiles[i].source ) === answer.sourceFile ) {
            sourceFile = sourceFiles[i];
            break;
          }

        }
      }

      Callback( sourceFile );
    } );
  } );
};
