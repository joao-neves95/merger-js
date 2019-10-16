const Utils = require( '../utils' );
const ParsedLine = require( '../../models/parsedLineModel' );
const ImportType = require( '../../enums/importType' );

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

    // TODO: Reduce code duplication.

    // #region IMPORT FROM RELATIVE PATH OR DIRECTORY

    if ( line.startsWith( '@import', 2 ) || line.startsWith( '@', 2 ) ) {
      parsedLine.importType = ImportType.RelativePath;
      line = Utils.removeImportFromInput( line );

      // #endregion IMPORT FROM RELATIVE PATH OR DIRECTORY

      // #region IMPORT FROM node_modules

    } else if ( line.startsWith( '$import', 2 ) || line.startsWith( '$', 2 ) ) {
      parsedLine.importType = ImportType.NodeModules;
      line = Utils.removeImportFromInput( line );

      // #endregion IMPORT FROM node_modules

      // #region IMPORT FROM AN URL

    } else if ( line.startsWith( '%import', 2 ) || line.startsWith( '%', 2 ) || line.startsWith( '%%', 2 ) ) {
      parsedLine.forceInstall = line.startsWith( '%%', 2 );
      line = Utils.removeImportFromInput( line );

      // #region GITHUB SYNTAX DEFENITION COMMENTS

      // SINTAX:
      // // %import<<GH::{branch} '{user}/{repo}/{pathToFile}.js'
      // // %import<<GH::{branch}<<DIR '{user}/{repo}/{pathToFile}.js'
      // // %import<<GH::master<<DIR '{user}/{repo}/{pathToFile}.js'
      // DEPRECATED syntax: // %import<<GH '{user}/{repo}/{branch}/{pathToFile}.js'

      // #endregion GITHUB SYNTAX DEFENITION COMMENTS

      // #region IMPORT FROM GITHUB

      if ( line.startsWith( '<<gh' ) ||
        line.startsWith( '<<GH' ) ||
        line.startsWith( '<<github' ) ||
        line.startsWith( '<<GITHUB' )
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
        }

        parsedLine.isGithubNewSyntax = false;

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
    return line.startsWith( '<<dir' ) ||
           line.startsWith( '<<DIR' ) ||
           line.startsWith( '<<directory' ) ||
           line.startsWith( '<<DIRECTORY' );
  }

}

module.exports = ImportLineParser;
