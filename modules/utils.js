'use strict';
const fs = require('fs');
const path = require('path');
const findFileOrDir = require('./findFileOrDir');

module.exports = {
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

  readConfigFile: ( Callback ) => {
    findFileOrDir( 'merger-config.json', configFilePath => {
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
  }
};
