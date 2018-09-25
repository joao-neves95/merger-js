'use strict';
const fs = require('fs');
const path = require('path');
const whilst = require( '../node_modules/neo-async' ).whilst;
const each = require( '../node_modules/neo-async' ).each;
const style = require( './consoleStyling' );

const utils = {
  readDir: ( path, callback ) => {
    fs.readdir( path, 'utf-8', ( err, files ) => {
      if ( err )
        callback( err, null );
      else
        callback( null, files );
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
    utils.findFileOrDir( 'merger-config.json', configFilePath => {
      fs.readFile( configFilePath, 'utf-8', ( err, data ) => {
        if ( err ) return Callback( err, null, null );

        Callback( null, configFilePath, data );
      } );
    } );
  },

  /**
   * @param { string } importFile The import file line input (from the user header/source file).
   * @returns { string } The cleaned file name.
   */
  cleanImportFileInput: ( importFile ) => {
    return importFile.replace( /\'|;|"|,|\/\/@import|\/\/@|\/\/\$import|\/\/$/g, '' );
  },

  /**
   * Searches for and returns the path of the requested file or directory.
   * NOTE: It returns void if the file/directory isn't found or a console error in case the input is "merger-config.json".
   * 
   * @param { string } fileOrDir The name of the file or directory to find.
   * @param { Function } Callback A callback that receives the complete file/directory path.
   * 
   * @returns { string | void }
   */
  findFileOrDir: ( fileOrDir, Callback ) => {
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
        fs.readdir( currentDir, 'utf-8', ( err, files ) => {
          if ( err )
            return console.error( style.styledError, err );

          each( files, ( file, eachAgain ) => {

            if ( file === fileOrDir ) {
              foundFile = true;
              return Callback( path.join( currentDir, file ) );
            } else {
              eachAgain();
            }

          }, ( err ) => {
            if ( err )
              return console.error( style.styledError, err );

            lastDir = currentDir;
            currentDir = path.join( currentDir, '../' );
            whilstAgain( null, null );
          } );
        } );
      },
      ( err, n ) => {
        if ( err )
          return console.error( style.styledError, err );

        if ( fileOrDir === 'merger-config.json' )
          return console.error( style.styledError, ' merger-config file not found. Please run "merger init".' );

        return;
      }
    );
  }
};

module.exports = utils;
