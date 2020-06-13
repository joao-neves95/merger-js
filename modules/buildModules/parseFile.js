/*
 * Copyright (c) 2018-2020 João Pedro Martins Neves - All Rights Reserved.
 *
 * MergerJS (merger-js) is licensed under the
 * GPLv3.0 license (GNU General Public License v3.0),
 * located in the root of this project, under the name "LICENSE.md".
 */

'use strict';
const path = require('path');
const lineByLine = require( 'line-by-line' );
const FileParserParams = require( '../../models/fileParserParams' );
const SyntaxParser = require( './syntaxParser' );
const handleImports = require( './handleImports' );

/**
 * Parses a file and executes the required actions for building it, like constructing the build order, normalize paths,
 * download packages, save them on node_modules, etc.
 *
 * @param { FileParserParams } params
 *
 * @returns { Promise<string[]> }
 */
module.exports = ( params ) => {
  return new Promise( async ( _res, _rej ) => {

    let lineNum = 0;
    let lastLineWasComment = false;
    let buildOrder = [];
    buildOrder.push( path.basename( params.filePath ) );

    const rl = new lineByLine( params.filePath, {
      encoding: 'utf8',
      skipEmptyLines: true
    } );

    rl.on( 'line', async ( line ) => {
      rl.pause();

      const parsedLine = SyntaxParser.parseLine( line );
      parsedLine.headerFilePath = params.filePath;
      lastLineWasComment = parsedLine.isComment;

      buildOrder = await handleImports( parsedLine, buildOrder );

      ++line;
      rl.resume();

      if ( lineNum >= params.maxLineCount && !lastLineWasComment ) {
        rl.close();
      }

    } );

    rl.on( 'end', () => {
      return _res( buildOrder );
    } );

  } );
};
