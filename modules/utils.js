/*
 * Copyright (c) 2018-2020 João Pedro Martins Neves - All Rights Reserved.
 *
 * MergerJS (merger-js) is licensed under the
 * GPLv3.0 license (GNU General Public License v3.0),
 * located in the root of this project, under the name "LICENSE.md".
 */

'use strict';
const fs = require('fs');
const path = require( 'path' );
const StaticClass = require( '../models/staticClassBase' );

class Utils extends StaticClass {

  constructor() {
    super( Utils.name );
  }

  /**
   * Reads the requested directory and returns an array of all its file names.
   * @param { string } path The directory path.
   * 
   * @returns { Promise<string[] | Error> }
   */
  static readDir( path ) {
    return new Promise( ( resolve, reject ) => {

      fs.readdir( path, 'utf8', ( err, files ) => {
        if ( err ) {
          return reject( err );

        } else {

          return resolve( files );
        }
      } );

    } );
  }

  /**
   * Creates a new directory.
   * Returns a promise with a boolean stating whether the file was created or not, or an Error.
   * 
   * @param { string } path
   * @param { boolean } doItRecursive
   * 
   * @returns { Promise<boolean | Error> }
   */
  static mkdir( path, doItRecursive = true ) {
    return new Promise( ( _res, _rej ) => {
      fs.mkdir( path, { recursive: doItRecursive }, ( err ) => {
        if ( err ) {
          if ( err.code !== 'EEXIST' )
            return _rej( err );

          return _res( false );
        }

        return _res( true );
      } );
    } );
  }

  /**
   * 
   * @param { string } dir
   * @param { string } fileName
   * @param { object } data <object>
   * 
   * @returns { void | Error }
   */
  static writeJSONFile( dir, fileName, data ) {
    fs.writeFileSync(
      path.join( dir, fileName + '.json' ),
      JSON.stringify( data, null, '\t' ),
      'utf8'
    );
  }

  /**
   * 
   * @param { string } filePath
   * 
   * @returns { Promise<fs.Stats | Error> }
   */
  static fsStat( filePath ) {
    return new Promise( ( _res, _rej ) => {
      fs.stat( filePath, async ( err, stats ) => {
        if ( err ) {
          return _rej( err );
        }

        return _res( stats );
      } );
    } );
  }

  /**
   * Deletes the requested file.
   * @param { string } filePath
   * 
   * @returns { Promise<void> }
   */
  static deleteFile( filePath ) {
    return new Promise( ( _res, _rej ) => {
      fs.unlink( filePath, ( err ) => {
        if ( err ) {
          return _rej( err );
        }

        return _res();
      } );
    } );
  }

  static isNullOrUndefined( val ) {
    return val === null || val === undefined;
  }

  static isNullOrEmptyStr( str ) {
    return str === null || str === undefined || str === '';
  }

  // Based on npm's strip-bom.
  /**
   * Remove unicode character FEFF (UTF-16 BOM) from a string block.
   * @param { string } stringBlock
   */
  static removeBOM( stringBlock ) {
    if ( stringBlock.charCodeAt( 0 ) === 0xFEFF )
      return stringBlock.slice( 1 );

    return stringBlock;
  }

  /**
   * @param { string } importStatement The import file line input (from the user header/source file).
   * @returns { string } The cleaned file name.
   */
  static cleanImportFileInput( importStatement ) {
    return Utils.removeImportFromInput( importStatement.replace( /\'|;|"|,/g, '' ) );
  }

  static removeImportFromInput( importStatement ) {
    return importStatement.replace( /(?<!:)\/\/|@import|@|\$import|\$|\%import|\%|\%%import|\%\%/gi, '' );
  }

  static removeGithubTokenFromImport( importStatement ) {
    return importStatement.replace( /<<GH|<<GITHUB/gi, '' );
  }

  static removeDirTokenFromImport( importStatement ) {
    return importStatement.replace( /<<DIRECTORY|<<DIR/gi, '' );
  }

  /**
   * @param { string } url
   * 
   * @return { string }
   */
  static getFileNameFromUrl( url ) {
    const fileNameArr = new URL( url ).pathname.split( '/' );
    return fileNameArr[fileNameArr.length - 1];
  }

  /**
   * Get the extension name of a file.
   * Same as Nodejs.path.extname( path )
   * 
   * @param { string } path
   * @returns { string }
   */
  static fileExt( inputPath ) {
    return path.extname( inputPath );
  }

  static buildGithubRepoDirName( user, repo ) {
    return `${user}@${repo}`;
  }

  /**
   * Returns the complete path of the requested file or directory.
   * 
   * @param { string } fileOrDirName The name of the file or directory to search for.
   */
  static findFileOrDir( fileOrDirName ) {
    let currentDir = process.cwd();
    let lastDir = '';
    /** @type { string[] } */
    let currentDirFiles;
    /** @type { string } */
    let currentFile;

    let i;
    // When the loop hits the root dir.
    while ( currentDir !== lastDir && currentDir !== null ) {
      currentDirFiles = fs.readdirSync( currentDir, 'utf8' );

      for ( i = 0; i < currentDirFiles.length; ++i ) {
        currentFile = currentDirFiles[i];

        if ( currentFile === fileOrDirName ) {
          return path.join( currentDir, currentFile );
        }
      }

      lastDir = currentDir;
      currentDir = path.join( currentDir, '../' );
    }
  }

  /**
   * @param { string } path
   * @param { Function } Callback Optional. (err, <boolean>)
   * 
   * @returns { Promise<boolean | Error> }
   */
  static fileExists( path, Callback ) {
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
  }

  static dirExists( thePath ) {
    return new Promise( ( _res, _rej ) => {
      try {

        fs.stat( path.normalize( thePath ), ( err, stats ) => {
          if ( err )
            return _res( false );

          return _res( stats.isDirectory() );
        } );

      } catch ( e ) {
        return _res( false );
      }
    } );
  }

  /**
   * @param { string } fileName
   * @param { string } data
   * @param { Function } Callback Optional. Receives an error, in case there is one or void.
   * 
   * @returns { Promise<void | Error> }
   */
  static async saveFileInNodeModules( fileName, data, Callback ) {
    return new Promise( async ( resolve, reject ) => {

      const thisDirName = path.dirname( path.join( global.config.nodeModulesPath, fileName ) );
      const dirExists = await Utils.dirExists( thisDirName );
      if ( !dirExists )
        await Utils.mkdir( thisDirName );

      fs.writeFile( path.join( thisDirName, path.basename( fileName ) ), data, 'utf8', ( err ) => {
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
  }

  /**
   * NOTE: Only use this function after the initial config.js configuration parser has been called.
   * It returns true if node_modules was created or false if it was not necessary, or an Error.
   * 
   * @param { Function } Callback Optional (error, <boolean>)
   * 
   * @return { Promise<boolean | Error> }
   */
  static createNodeModulesIfNeeded( Callback ) {
    return new Promise( ( resolve, reject ) => {

      if ( global.config.nodeModulesPath === null || global.config.nodeModulesPath === undefined || global.config.nodeModulesPath === '' ) {
        const nodeModulesPath = path.join( path.dirname( global.config.mergerConfigPath ), 'node_modules' );

        fs.mkdir( nodeModulesPath, async ( err ) => {
          if ( err ) {
            if ( Callback )
              return Callback( err, null );

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
}

module.exports = Utils;
