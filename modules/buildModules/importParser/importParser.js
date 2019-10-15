const ParsedLine = require( '../../../models/parsedLineModel' );
const ImportType = require( '../../../enums/importType' );

class ImportParser {

  constructor() {
    throw new Error( 'Can not intantiate a static class' );
  }

  /**
   * 
   * @param { string } line
   * 
   * @return { ParsedLine }
   */
  static parseLine( line ) {
    const parsedLine = new ParsedLine();
    parsedLine.isComment = line.trimStart().startsWith( '//' );

    line = line.replace( /\s/g, '' );

    if ( parsedLine.isComment ) {
      return parsedLine;
    }

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
        break;

      // #endregion IMPORT FROM node_modules

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
          let branchName = 'master';
          let isNewSyntax = false;

          parsedLine.importType = ImportType.GitHub;

          line = Utils.removeGithubTokenFromImport( line );

          if ( treatedLine.startsWith( '::' ) ) {
            branchName = '';
            line = line.replace( /::/g, '' );

            for ( let i = 0; i < treatedLine.length; ++i ) {
              if ( line[i] === '<' || line[i] === "'" || line[i] === ' ' )
                break;

              branchName += treatedLine[i];
            }

            isNewSyntax = true;

            line = line.substring( branch.length );
          }

          parsedLine.branchName = branchName;

        } else {
          parsedLine.importType = ImportType.URL;
        }

        break;

      default:
        parsedLine.importType = ImportType.Unknown;
        break;

    }

  }

  static __pathIsDir() {
    return treatedLine.startsWith( '<<dir' ) ||
           treatedLine.startsWith( '<<DIR' ) ||
           treatedLine.startsWith( '<<directory' ) ||
           treatedLine.startsWith( '<<DIRECTORY' );
  }

}

module.exports = ImportParser;
