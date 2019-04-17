/*
 * Copyright (c) 2018-2019 João Pedro Martins Neves - All Rights Reserved.
 *
 * MergerJS (merger-js) is licensed under the MIT license, located in
 * the root of this project, under the name "LICENSE.md".
 *
 */

'use strict';
const path = require('path');
const lineByLine = require( 'line-by-line' );
const fileDownloader = require( '../fileDownloader' );
const Utils = require( '../utils' );
const addPropertyToConfig = require( '../CLIModules/editConfigFile' ).addProperty;
const style = require( '../consoleStyling' );
const ConfigKeysType = require( '../../models/configKeysEnum' );
const HOST_RAW_GITHUB = 'https://raw.githubusercontent.com/';

module.exports = ( Path, Callback ) => {
  let lineNum = 0;
  let lastLineWasComment = false;
  let buildOrder = [];
  buildOrder.push( path.basename( Path ) );

  const rl = new lineByLine( Path, {
    encoding: 'utf8',
    skipEmptyLines: true
  } );

  rl.on( 'line', async ( line ) => {
    rl.pause();
    let thisFile;
    let treatedLine = line.replace( /\s/g, '' );

    lastLineWasComment = treatedLine.startsWith( '//' );

    // #region IMPORT FROM RELATIVE PATH OR DIRECTORY

    if ( treatedLine.startsWith( '@import', 2 ) || treatedLine.startsWith( '@', 2 ) ) {
      treatedLine = Utils.removeImportFromInput( treatedLine );

      // FROM A DIRECTORY.
      const wasDir = await ____addAllDirectoryToBuildOrder( buildOrder, Path, treatedLine );
      if ( wasDir )
        thisFile = null;
      else
        // FROM A RELATIVE FILE PATH.
        thisFile = Utils.cleanImportFileInput( treatedLine );

      ++lineNum;

    // #endregion

    // #region IMPORT FROM node_modules

    } else if ( treatedLine.startsWith( '$import', 2 ) || treatedLine.startsWith( '$', 2 ) ) {
      treatedLine = Utils.removeImportFromInput( treatedLine );

      try {
        const createdNodeModules = await Utils.createNodeModulesIfNeeded();
        if ( createdNodeModules )
          await addPropertyToConfig( ConfigKeysType.nodeModulesPath, global.config.nodeModulesPath );

        // AN ENTIRE DIRECTORY.
        const wasDir = await ____addAllDirectoryToBuildOrder( buildOrder, global.config.nodeModulesPath, treatedLine );
        if ( wasDir )
          thisFile = null;
        else {
          // A FILE.
          thisFile = Utils.cleanImportFileInput( treatedLine );
          thisFile = path.join( global.config.nodeModulesPath, thisFile );
        }

      } catch ( e ) {
        return ____nodeModulesCreationError( thisFile );
      }

      ++lineNum;

      // #endregion

      // #region IMPORT FROM AN URL

    } else if ( treatedLine.startsWith( '%import', 2 ) || treatedLine.startsWith( '%', 2 ) || treatedLine.startsWith( '%%', 2 ) ) {
      const forceInstall = treatedLine.startsWith( '%%', 2 );
      treatedLine = Utils.removeImportFromInput( treatedLine );

      try {
        const createdNodeModules = await Utils.createNodeModulesIfNeeded();
        if ( createdNodeModules )
          await addPropertyToConfig( ConfigKeysType.nodeModulesPath, global.config.nodeModulesPath );

      } catch ( e ) {
        return ____nodeModulesCreationError( line );
      }

      // FROM GITHUB
      if ( treatedLine.startsWith( '<<gh' ) ||
           treatedLine.startsWith( '<<GH' ) ||
           treatedLine.startsWith( '<<github' ) ||
           treatedLine.startsWith( '<<GITHUB' ) ) {

        let filePath = Utils.cleanImportFileInput( treatedLine );
        filePath = filePath.replace( /<<gh|<<GH|<<github|<<GITHUB/g, '' );
        const fileName = Utils.getFileNameFromUrl( HOST_RAW_GITHUB + filePath );

        let fileExists = true;
        if ( !forceInstall )
          fileExists = await Utils.fileExists( path.join( global.config.nodeModulesPath, fileName ) );

        if ( !fileExists || forceInstall ) {
          try {
            await fileDownloader.fromGitHub( filePath );

          } catch ( e ) {
            // Being logged in fileDownloader.js
          }
        }

        thisFile = path.join( global.config.nodeModulesPath, fileName );

      // FROM A SPECIFIC URL
      } else {
        let url = Utils.cleanImportFileInput( treatedLine );
        const fileName = Utils.getFileNameFromUrl( url );
        let fileExists = true;
        if ( !forceInstall )
          fileExists = await Utils.fileExists( path.join( global.config.nodeModulesPath, fileName ) );

        if ( !fileExists || forceInstall ) {
          try {
            await fileDownloader.fromUrl( url );

          } catch ( e ) {
            console.error( style.styledError, `There was an error while downloading a file from url ("${url}")\n`, e );
          }
        }

        thisFile = path.join( global.config.nodeModulesPath, fileName );
      }

      ++lineNum;

      // #endregion
    }

    try {
      if ( path.extname( thisFile ) !== '.js' )
        thisFile += '.js';

      if ( !buildOrder.includes( thisFile ) && thisFile !== undefined && thisFile !== null )
        buildOrder.push( thisFile );

    } catch ( e ) {
      // Invalid import statement.
    }

    rl.resume();

    if ( lineNum >= 20 && !lastLineWasComment )
      rl.close();

  } );

  rl.on( 'end', () => {
    return Callback( buildOrder );
  } );
};

const ____addAllDirectoryToBuildOrder = async ( buildOrder, thePath, treatedLine ) => {
  if ( treatedLine.startsWith( '<<dir' ) ||
       treatedLine.startsWith( '<<DIR' ) ||
       treatedLine.startsWith( '<<directory' ) ||
       treatedLine.startsWith( '<<DIRECTORY' ) )
  {
    treatedLine = treatedLine.replace( /<<dir|<<DIR|<<directory|<<DIRECTORY/g, '' );
    treatedLine = Utils.cleanImportFileInput( treatedLine );
    const thisDir = path.join( thePath, treatedLine );

    try {
      const files = await Utils.readDir( thisDir );

      for ( let i = 0; i < files.length; ++i ) {
        if ( path.extname( files[i] ) === '.js'  )
          buildOrder.push( path.join( thisDir, files[i] ) );
      }

    } catch ( e ) {
      console.error( style.styledError, `There was an error while reading the file names from the directory: "${thisDir}". Probably it does not exist.\n\n`, e );
      process.exit( 1 );
      process.kill( process.pid, 'SIGINT' );
      setTimeout( () => {
        process.kill( process.pid, 'SIGKILL' );
      }, 5000 );
    }

    return true;
  }

  return false;
};

const ____nodeModulesCreationError = ( fileName ) => {
  return console.error(
    style.styledError,
    style.errorText( `There has been an error while creating the node_modules file.\n Could not merge "${fileName}", "node_modules" directory not found.` ),
    '\n Please run "npm init", if you didn\'t, and install a package with "npm install <package name>".\n'
  );
};
