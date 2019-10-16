const path = require( 'path' );
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

    if ( parsedLine.isComment ) {
      return parsedLine;
    }

    // TODO: Reduce code duplication.
    switch ( line ) {

      // #region IMPORT FROM RELATIVE PATH OR DIRECTORY

      case line.startsWith( '@import', 2 ) || line.startsWith( '@', 2 ):
        parsedLine.importType = ImportType.RelativePath;
        line = Utils.removeImportFromInput( line );
        parsedLine.isDir = ImportParser.__pathIsDir( line );
        break;

      // #endregion IMPORT FROM RELATIVE PATH OR DIRECTORY

      // #region IMPORT FROM node_modules

      case line.startsWith( '$import', 2 ) || line.startsWith( '$', 2 ):
        parsedLine.importType = ImportType.NodeModules;
        line = Utils.removeImportFromInput( line );
        parsedLine.isDir = ImportParser.__pathIsDir( line );
        break;

      // #endregion IMPORT FROM node_modules

      // #region IMPORT FROM AN URL

      case line.startsWith( '%import', 2 ) || line.startsWith( '%', 2 ) || line.startsWith( '%%', 2 ):
        parsedLine.forceInstall = line.startsWith( '%%', 2 );
        line = Utils.removeImportFromInput( line );

        // #region GITHUB SYNTAX DEFENITION COMMENTS

        // SINTAX:
        // // %import<<GH::{branch} '{user}/{repo}/{pathToFile}.js'
        // // %import<<GH::{branch}<<DIR '{user}/{repo}/{pathToFile}.js'
        // // %import<<GH::master<<DIR '{user}/{repo}/{pathToFile}.js'
        // DEPRECATED syntax: // %import<<GH '{user}/{repo}/{branch}/{pathToFile}.js'

        // #endregion GITHUB SYNTAX DEFENITION COMMENTS

        if ( line.startsWith( '<<gh' ) ||
             line.startsWith( '<<GH' ) ||
             line.startsWith( '<<github' ) ||
             line.startsWith( '<<GITHUB' )
        ) {
          parsedLine.importType = ImportType.GitHub;
          parsedLine.branchName = 'master';

          line = Utils.removeGithubTokenFromImport( line );

          if ( treatedLine.startsWith( '::' ) ) {
            parsedLine.branchName = '';
            line = line.replace( /::/g, '' );

            for ( let i = 0; i < line.length; ++i ) {
              if ( line[i] === '<' || line[i] === "'" || line[i] === ' ' )
                break;

              parsedLine.branchName += treatedLine[i];
            }

            parsedLine.isGithubNewSyntax = true;
            line = line.substring( branch.length );
          }

          parsedLine.isDir = ImportLineParser.__pathIsDir( line );

        } else {
          parsedLine.importType = ImportType.SpecificURL;
        }

      // #endregion IMPORT FROM AN URL

        break;

      default:
        parsedLine.importType = ImportType.Unknown;
        break;

    }

    if ( parsedLine.isDir ) {
      line = Utils.removeDirTokenFromImport( line );
    }

    parsedLine.path = Utils.cleanImportFileInput( line );

  }

  static __pathIsDir() {
    return treatedLine.startsWith( '<<dir' ) ||
           treatedLine.startsWith( '<<DIR' ) ||
           treatedLine.startsWith( '<<directory' ) ||
           treatedLine.startsWith( '<<DIRECTORY' );
  }

}

module.exports = ImportLineParser;
