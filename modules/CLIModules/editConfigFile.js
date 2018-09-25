'use strict';
const fs = require('fs');
const path = require('path');
const writeConfigFile = require('../utils').writeJSONFile;
const readConfigFile = require('../utils').readConfigFile;
const style = require('../consoleStyling');
const newTimestamp = require('../newTimestamp').small;

module.exports = {
  editConfigKey: ( key, value, Callback ) => {
    readConfigFile( ( err, configFilePath, data ) => {
      if ( err )
        return console.error( err );

      let userConfig;

      try {
        userConfig = JSON.parse( data );
        userConfig[key] = value;
      } catch ( e ) {
        return console.error( style.styledError, e );
      }

      writeConfigFile( path.dirname( configFilePath ), 'merger-config', userConfig, ( err, data ) => {
        if ( err )
          return console.error( err );

        let timestamp = newTimestamp();
        console.info( `\n ${timestamp} - ${style.successText( 'Update to the merger-config file successful.' )}\n`, data );

        if ( Callback )
          Callback();
      } );
    } );
  },

  addFileToConfig: ( newSourceFile, Callback ) => {
    readConfigFile( ( err, configFilePath, data ) => {
      if ( err )
        return console.error( style.styledError, err );

      let userConfig;

      try {
        userConfig = JSON.parse( data );
        userConfig.sourceFiles.push( newSourceFile );
      } catch ( e ) {
        return console.error( style.styledError, e );
      }

      writeConfigFile( path.dirname( configFilePath ), 'merger-config', userConfig, ( err, data ) => {
        if ( err )
          return console.error( err );

        let timestamp = newTimestamp();
        console.info( `\n ${timestamp} - ${style.successText( 'Successsfuly added the new source file to the MergerJS configuration file.' )}\n`, data );

        if ( Callback )
          Callback();
      } );
    } );
  },

  removeSourceFile: ( sourceFileObject, Callback ) => {
    readConfigFile( ( err, configFilePath, data ) => {
      if ( err )
        return console.error( style.styledError, err );

      let userConfig;

      try {
        userConfig = JSON.parse( data );
        // const fileIndex = userConfig.sourceFiles.indexOf(sourceFileObject);

        const searchFileIndex = ( userConfig ) => {
          for ( let i = 0; i < userConfig.sourceFiles.length; ++i ) {
            if ( JSON.stringify( userConfig.sourceFiles[i] ) === JSON.stringify( sourceFileObject ) ) {
              return i;
            }
          }
          return -1;
        };

        const fileIndex = searchFileIndex( userConfig );

        userConfig.sourceFiles.splice( fileIndex, 1 );
      } catch ( e ) {
        return console.error( style.styledError, e );
      }

      writeConfigFile( path.dirname( configFilePath ), 'merger-config', userConfig, ( err, data ) => {
        if ( err ) return console.error( err );

        let timestamp = newTimestamp();
        console.info( `\n ${timestamp} - ${style.successText( 'Successsfuly removed the source file from the MergerJS configuration file.' )}\n`, data );

        if ( Callback )
          Callback();
      } );
    } );
  },

  /**
   * @param { string } key Config property.
   * @param { string } value Config property value.
   * @param { Function } Callback Optional. Called when the config file editing ends.
   */
  addProperty: ( key, value, Callback ) => {
    readConfigFile( ( err, configFilePath, data ) => {
      let userConfig = JSON.parse( data );
      userConfig[key] = value;

      writeConfigFile( path.dirname( configFilePath ), 'merger-config', userConfig, ( err, data ) => {
        if ( err ) return console.error( err );

        if ( Callback )
          Callback();
      } );
    } );
  }
};
