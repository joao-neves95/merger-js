/*
 * Copyright (c) 2018-2020 João Pedro Martins Neves - All Rights Reserved.
 *
 * MergerJS (merger-js) is licensed under the MIT license, located in
 * the root of this project, under the name "LICENSE.md".
 *
 */

const Utils = require( '../utils' );
const TokenType = require( '../../enums/tokenType' );
const ImportType = require( '../../enums/importType' );
const ParsedLine = require( '../../models/parsedLineModel' );

class ImportLineParser {

  constructor() {
    throw new Error( 'Can not intantiate a static class' );
  }

  /**
   * 
   * @param { string } line
   * 
   * @return { ParsedLine }
   */
  static parse( line ) {
    const parsedLine = new ParsedLine();
    parsedLine.isComment = line.trimStart().startsWith( '//' );

    line = line.replace( /\s/g, '' );

    if ( !parsedLine.isComment ) {
      return parsedLine;
    }

    // #region IMPORT FROM RELATIVE PATH OR DIRECTORY

    if ( line.startsWith( TokenType.importPath, 2 ) || line.startsWith( TokenType.importPath_simbol, 2 ) ) {
      parsedLine.importType = ImportType.RelativePath;
      line = Utils.removeImportFromInput( line );

      // #endregion IMPORT FROM RELATIVE PATH OR DIRECTORY

      // #region IMPORT FROM node_modules

    } else if ( line.startsWith( TokenType.importNodeModules, 2 ) || line.startsWith( TokenType.importNodeModules_simbol, 2 ) ) {
      parsedLine.importType = ImportType.NodeModules;
      line = Utils.removeImportFromInput( line );

      // #endregion IMPORT FROM node_modules

      // #region IMPORT FROM AN URL

    } else if ( line.startsWith( TokenType.importUrl, 2 ) || line.startsWith( TokenType.importUrl_simbol, 2 ) || line.startsWith( TokenType.doubleImportUrl_simbol, 2 ) ) {
      parsedLine.forceInstall = line.startsWith( TokenType.doubleImportUrl_simbol, 2 );
      line = Utils.removeImportFromInput( line );

      // #region GITHUB SYNTAX DEFENITION COMMENTS

      // SINTAX:
      // // %import<<GH::{branch} '{user}/{repo}/{pathToFile}.js'
      // // %import<<GH::{branch}<<DIR '{user}/{repo}/{pathToFile}.js'
      // // %import<<GH::master<<DIR '{user}/{repo}/{pathToFile}.js'
      // DEPRECATED SYNTAX: // %import<<GH '{user}/{repo}/{branch}/{pathToFile}.js'

      // #endregion GITHUB SYNTAX DEFENITION COMMENTS

      // #region IMPORT FROM GITHUB

      if ( line.startsWith( TokenType.push_gh ) ||
           line.startsWith( TokenType.push_GH ) ||
           line.startsWith( TokenType.push_github ) ||
           line.startsWith( TokenType.push_GITHUB )
      ) {
        parsedLine.importType = ImportType.GitHub;
        parsedLine.branchName = 'master';

        line = Utils.removeGithubTokenFromImport( line );

        if ( line.startsWith( '::' ) ) {
          parsedLine.branchName = '';
          line = line.replace( /::/g, '' );

          for ( let i = 0; i < line.length; ++i ) {
            if ( line[i] === '<' || line[i] === "'" || line[i] === ' ' )
              break;

            parsedLine.branchName += line[i];
          }

          parsedLine.isGithubNewSyntax = true;
          line = line.substring( parsedLine.branchName.length );

        } else {
          parsedLine.isGithubNewSyntax = false;
        }


        // #endregion IMPORT FROM GITHUB

        // #region IMPORT FROM A SPECIFIC URL

      } else {
        parsedLine.importType = ImportType.SpecificURL;
      }

      // #endregion IMPORT FROM A SPECIFIC URL

      // #endregion IMPORT FROM AN URL

    } else {
      parsedLine.importType = ImportType.Unknown;
    }

    parsedLine.isDir = ImportLineParser.__pathIsDir( line );

    if ( parsedLine.isDir ) {
      line = Utils.removeDirTokenFromImport( line );
    }

    parsedLine.path = Utils.cleanImportFileInput( line );
    return parsedLine;
  }

  static __pathIsDir( line ) {
    return line.startsWith( TokenType.push_dir ) ||
           line.startsWith( TokenType.push_DIR ) ||
           line.startsWith( TokenType.push_directory ) ||
           line.startsWith( TokenType.push_DIRECTORY );
  }

}

module.exports = ImportLineParser;
