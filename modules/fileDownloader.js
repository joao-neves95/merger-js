/*
 * Copyright (c) 2018-2019 João Pedro Martins Neves - All Rights Reserved.
 *
 * MergerJS (merger-js) is licensed under the MIT license, located in
 * the root of this project, under the name "LICENSE.md".
 *
 */

'use strict';
const httpClient = require( './httpClient' );
const Utils = require( './utils' );
const style = require( './consoleStyling' );
const HOST_RAW_GITHUB = 'https://raw.githubusercontent.com/';

module.exports = {
  /**
   * Downloads a file from an URL and saves it to node_modules.
   * 
   * @returns { Promise<string | Error> }
   */
  fromUrl: ( url, Callback ) => {
    return new Promise( async ( resolve, reject ) => {

        try {
          const fileName = Utils.getFileNameFromUrl( url );
          const fileContent = await httpClient.getAsync( url, false );
          await Utils.saveFileInNodeModules( fileName, fileContent );

          if ( Callback )
            return Callback( fileName );

          resolve( fileName );

        } catch ( err ) {
          if ( Callback )
            return Callback( err, null );

          reject( err );
        }

    } );
  },

  /**
   * Downloads a file from GitHub and saves it to node_modules. Returns the file name or an error.
   * 
   * @param { string } path <userName>/<repositoryName>/(<branchName>)/<pathToFile>
   * @param { function } Callback (<string | Error>)
   * 
   * @returns { Promise<string | Error> }
   */
  fromGitHub: ( path, Callback ) => {
    return new Promise( async ( resolve, reject ) => {

      if ( path.startsWith( '/' ) )
        path = path.substring( 1 );

      let url = HOST_RAW_GITHUB + path;
      const fileName = Utils.getFileNameFromUrl( url );
      let fileContent = null;

      try {
          fileContent = await httpClient.getAsync( url, false );

          if ( fileContent === '404: Not Found\n' ) {
            let urlArr = new URL( url ).pathname.split( '/' );
            urlArr.splice( 3, 0, 'master' );
            url = HOST_RAW_GITHUB + urlArr.join( '/' );

            try {
              fileContent = await httpClient.getAsync( url, false );

              if ( fileContent === '404: Not Found\n' )
                console.error( style.styledError, `There was an error while downloading file from GitHub ("${new URL( url ).pathname}"):\n` );

            } catch ( e ) {
              console.error( style.styledError, `There was an error while downloading file from GitHub ("${new URL( url ).pathname}"):\n` );
            }
          }

        } catch ( e ) {
          console.error( style.styledError, `There was an error while downloading file from GitHub ("${path}"):\n` );
        }

        try {
          await Utils.saveFileInNodeModules( fileName, fileContent );

          if ( Callback )
            return Callback( fileName );

          resolve( fileName );

        } catch ( e ) {
          console.error( style.styledError, `There was an error while saving the file from GitHub ("${path}") on node_modules:\n` );

          if ( Callback )
            return Callback( e );

          return reject( e );
        }

    } );
  }
};
