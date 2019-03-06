/*
 * Copyright (c) 2018-2019 João Pedro Martins Neves - All Rights Reserved.
 *
 * MergerJS (merger-js) is licensed under the MIT license, located in
 * the root of this project, under the name "LICENSE.md".
 *
 */

'use strict';
const fs = require('fs');
const path = require( 'path' );
const url = require( 'url' );
const whilst = require( '../node_modules/neo-async' ).whilst;
const each = require( '../node_modules/neo-async' ).each;
const style = require( './consoleStyling' );

const utils = {
  /**
   * @param { string } path The directory path.
   * @param { Function } Callback Optional. (err, files[])
   * 
   * @returns { Promise<string[] | Error> }
   */
  readDir: ( path, Callback ) => {
    return new Promise( ( resolve, reject ) => {

      fs.readdir( path, 'utf8', ( err, files ) => {
        if ( err ) {
          if ( Callback )
            return Callback( err, null );

          return reject( err );

        } else {
          if (Callback)
            return Callback( null, files );

          return resolve( files );
        }
      } );

    } );
  },

  writeJSONFile: ( dir, fileName, data, callback ) => {
    let jsonData = JSON.stringify( data, null, '\t' );

    fs.writeFile( path.join( dir, fileName + '.json' ), jsonData, 'utf8', ( err ) => {
      if ( err )
        callback( err, null );
      else
        callback( null, jsonData );
    } );
  },

  /**
   * @param { Function } Callback Callback return arguments: ( error, configFilePath, data )
   */
  readConfigFile: ( Callback ) => {
    utils.findFileOrDir( 'merger-config.json', (err, configFilePath ) => {
      fs.readFile( configFilePath, 'utf8', ( err, data ) => {
        if ( err ) return Callback( err, null, null );

        return Callback( null, configFilePath, data );
      } );
    } );
  },

  // Based on npm's strip-bom.
  /**
   * Remove unicode character FEFF (UTF-16 BOM) from a string block.
   * @param { string } stringBlock
   */
  removeBOM( stringBlock ) {
    if ( stringBlock.charCodeAt( 0 ) === 0xFEFF )
      return stringBlock.slice( 1 );

    return stringBlock;
  },

  /**
   * @param { string } importStatement The import file line input (from the user header/source file).
   * @returns { string } The cleaned file name.
   */
  cleanImportFileInput: ( importStatement ) => {
    return importStatement.replace( /\'|;|"|,|\/\/@import|\/\/@|\/\/\$import|\/\/$|\/\/\%import|\/\/%/g, '' );
  },

  removeImportFromInput: ( importStatement ) => {
    return importStatement.replace( /\/\/@import|\/\/@|\/\/\$import|\/\/$|\/\/\%import|\/\/%/g, '' );
  },

  /**
   * @param { string } url
   * 
   * @return { string }
   */
  getFileNameFromUrl: ( url ) => {
    const fileNameArr = new URL( url ).pathname.split( '/' );
    return fileNameArr[fileNameArr.length - 1];
  },

  /**
   * From the current directory ( process.cwd() ), it searches for and returns the path of the requested file or directory, false if the file was not found or an error.
   * 
   * @param { string } fileOrDir The name of the file or directory to find.
   * @param { Function } Callback Optional. Callback (error, <string | false>) that receives the complete file/directory path or false if not found.
   * 
   * @returns { Promise<string | false | Error> }
   */
  findFileOrDir: ( fileOrDir, Callback ) => {

    const returnError = ( err, reject, Callback ) => {
      console.error( style.styledError, err );

      if ( Callback )
        return Callback( err, false );

      return reject( err );
    };

    return new Promise( ( resolve, reject ) => {

      let currentDir = process.cwd();
      let foundFile = false;
      let lastDir;

      whilst( () => {
        let isToContinue;

        !currentDir ? isToContinue = false :
          ( lastDir === currentDir ) ? isToContinue = false :
            foundFile ? isToContinue = false :
              isToContinue = true;

        return isToContinue;
      },
        ( whilstAgain ) => {
          fs.readdir( currentDir, 'utf8', ( err, files ) => {
            if ( err )
              return returnError( err, reject, Callback );

            each( files, ( file, eachAgain ) => {

              if ( file === fileOrDir ) {
                foundFile = true;
                const filePath = path.join( currentDir, file );

                if ( Callback )
                  return Callback( null, filePath );

                return resolve( filePath );

              } else {
                eachAgain();
              }

            }, ( err ) => {
              if ( err )
                return returnError( err, reject, Callback );

              lastDir = currentDir;
              currentDir = path.join( currentDir, '../' );
              whilstAgain( null, null );
            } );
          } );
        },
        ( err, n ) => {
          if ( err )
            return returnError( err, reject, Callback );

          if ( fileOrDir === 'merger-config.json' )
            console.error( style.styledError, ' merger-config file not found. Please run "merger init".' );

          if ( Callback )
            return Callback( null, false );

          resolve( false );
        }
      );

    } );
  },

  /**
   * @param { string } path
   * @param { Function } Callback Optional. (err, <boolean>)
   * 
   * @returns { Promise<boolean | Error> }
   */
  fileExists: ( path, Callback ) => {
    return new Promise( ( resolve, reject ) => {

      fs.open( path, 'r', ( err, fd ) => {
        if ( err ) {
          if ( err.code === 'ENOENT' ) {

            if ( Callback )
              return Callback( null, false );

            return resolve( false );
          }

          if ( Callback )
            return Callback( err, null );

          return reject( err );
        }

        fs.closeSync( fd );

        if ( Callback )
          return Callback( null, true );

        return resolve( true );
      } );

    } );
  },

  /**
   * @param { string } fileName
   * @param { string } data
   * @param { Function } Callback Optional. Receives an error, in case there is one or void.
   * 
   * @returns { Promise<void | Error> }
   */
  saveFileInNodeModules: ( fileName, data, Callback ) => {
    return new Promise( ( resolve, reject ) => {

      fs.writeFile( path.join( global.config.nodeModulesPath, fileName ), data, 'utf8', ( err ) => {

        if ( err ) {
          if ( Callback )
            return Callback( err );

          reject( err );
        }

        if ( Callback )
          return Callback();

        resolve();
      } );
    } );
  },

  /**
   * NOTE: Only use this function after the initial config.js configuration parser has been called.
   * It returns true if node_modules was created or false if it was not necessary, or an Error.
   * 
   * @param { Function } Callback Optional (error, <boolean>)
   * 
   * @return { Promise<boolean | Error> }
   */
  createNodeModulesIfNeeded: ( Callback ) => {
    return new Promise( ( resolve, reject ) => {

      if ( global.config.nodeModulesPath === null || global.config.nodeModulesPath === undefined ) {
        const nodeModulesPath = path.join( path.dirname( global.config.mergerConfigPath ), 'node_modules' );

        fs.mkdir( nodeModulesPath, ( err ) => {
          if ( err ) {
            if ( Callback )
              return Callback( err );

            return reject( err );
          }

          global.config.nodeModulesPath = nodeModulesPath;

          if ( Callback )
            return Callback( null, true );

          return resolve( true );
        } );

      } else {
        // Not needed.
        if ( Callback )
          return Callback( null, false );

        return resolve( false );
      }
    } );
  }
};

module.exports = utils;
