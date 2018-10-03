'use strict';
const path = require('path');
const lineByLine = require( 'line-by-line' );
const fileDownloader = require( '../fileDownloader' );
const cleanImportFileInput = require( '../utils' ).cleanImportFileInput;
const removeImportFromInput = require( '../utils' ).removeImportFromInput;
const Utils = require( '../utils' );
const style = require( '../consoleStyling' );
const HOST_RAW_GITHUB = 'https://raw.githubusercontent.com/';

module.exports = ( Path, Callback ) => {
  let lineNum = 0;
  let buildOrder = [];
  buildOrder.push( path.basename( Path ) );

  const rl = new lineByLine( Path, {
    encoding: 'utf8',
    skipEmptyLines: true
  });

  rl.on( 'line', async ( line ) => {
    rl.pause();

    //( async () => {
      let thisFile;
      let treatedLine = line.replace( /\s/g, '' );

      // #region IMPORT FROM RELATIVE PATH

      if ( treatedLine.startsWith( '@import', 2 ) || treatedLine.startsWith( '@', 2 ) ) {
        // TODO: Add the dir sintax here.
        thisFile = cleanImportFileInput( treatedLine );
        ++lineNum;

      // #endregion

      // #region IMPORT FROM node_modules

      } else if ( treatedLine.startsWith( '$import', 2 ) || treatedLine.startsWith( '$', 2 ) ) {
        thisFile = cleanImportFileInput( treatedLine );

        try {
          const created = await Utils.createNodeModulesIfNeeded();

        } catch ( e ) {
          return nodeModulesCreationError( thisFile );
        }

        thisFile = path.join( global.config.nodeModulesPath, thisFile );
        ++lineNum;

      // #endregion

      // #region IMPORT FROM AN URL

      } else if ( treatedLine.startsWith( '%import', 2 ) || treatedLine.startsWith( '%', 2 ) ) {
        const removedImportLine = removeImportFromInput( treatedLine );

        try {
          const created = await Utils.createNodeModulesIfNeeded();

        } catch ( e ) {
          return nodeModulesCreationError( line );
        }

        // FROM GITHUB
        if ( removedImportLine.startsWith( '<<gh' ) ||
             removedImportLine.startsWith( '<<GH' ) ||
             removedImportLine.startsWith( '<<github' ) ||
             removedImportLine.startsWith( '<<GITHUB' ) ) {

          let filePath = cleanImportFileInput( removedImportLine );
          filePath = filePath.replace( /<<gh|<<GH|<<github|<<GITHUB/g, '' );
          const fileName = Utils.getFileNameFromUrl( HOST_RAW_GITHUB + filePath );
          const fileExists = await Utils.fileExists( path.join( global.config.nodeModulesPath, fileName ) );

          if ( !fileExists ) {
            try {
              await fileDownloader.fromGitHub( filePath );

            } catch ( e ) {
              // Beeing logged in fileDownloader.js
            }
          }

          thisFile = path.join( global.config.nodeModulesPath, fileName );

        // FROM A SPECIFIC URL
        } else {
          let url = cleanImportFileInput( removedImportLine );
          const fileName = Utils.getFileNameFromUrl( url );
          const fileExists = await Utils.fileExists( path.join( global.config.nodeModulesPath, fileName ) );

          if ( !fileExists ) {
            try {
              await fileDownloader.fromUrl( url );

            } catch ( e ) {
              console.error( style.styledError, `There was an error while downloading a file from url ("${url}")\n`, e );
            }
          }

          thisFile = path.join( global.config.nodeModulesPath, fileName );
        }

        // #endregion
      }

      try {
        if ( path.extname( thisFile ) !== '.js' )
          thisFile += '.js';

        if ( !buildOrder.includes( thisFile ) )
          buildOrder.push( thisFile );

      } catch ( e ) {
       // Invalid import statement.
      }

      rl.resume();

      if ( lineNum >= 20 && !treatedLine.startsWith( '//' ) )
        rl.close();

    //} )();
  } );

  rl.on( 'end', () => {
    return Callback( buildOrder );
  } );

  const nodeModulesCreationError = ( fileName ) => {
    return console.error(
      style.styledError,
      style.errorText( `There has been an error while creating the node_modules file.\n Could not merge "${fileName}", "node_modules" directory not found.` ),
      '\n Please run "npm init", if you didn\'t, and install a package with "npm install <package name>".\n'
    );
  };

};
