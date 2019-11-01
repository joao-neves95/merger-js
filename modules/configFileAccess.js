/*
 * Copyright (c) 2018-2019 João Pedro Martins Neves - All Rights Reserved.
 *
 * MergerJS (merger-js) is licensed under the MIT license, located in
 * the root of this project, under the name "LICENSE.md".
 *
 */

'use strict';
const fs = require( 'fs' );
const path = require( 'path' );
const writeConfigFile = require( './utils' ).writeJSONFile;
const findFileOrDir = require( './utils' ).findFileOrDir;
const StaticClass = require( '../models/staticClassBase' );
const Dictionary = require( 'js.system.collections' ).Dictionary;
const style = require( './consoleStyling' );
const newTimestamp = require( './newTimestamp' ).small;
const ConfigFileModel = require( '../models/userConfigModel' );
const SourceFileModel = require( '../models/sourceFileModel' );

/** (static) */
class ConfigFileAccess extends StaticClass {

  constructor() {
    super();
  }

  /**
   * Searches for the config file and returns [ configFilePath, data ]
   * 
   * @param { Function } Callback Callback return arguments: ( error, configFilePath, data )
   * 
   * @returns { Promise<string[] | Error> }
   */
  static readConfigFile( Callback ) {
    return new Promise( ( _res, _rej ) => {

      findFileOrDir( 'merger-config.json', ( err, configFilePath ) => {
        fs.readFile( configFilePath, 'utf8', ( err, data ) => {
          if ( err ) {
            if ( Callback ) {
              return Callback( err, null, null );
            }

            return _rej( err );
          }

          if ( Callback ) {
            return Callback( null, configFilePath, data );
          }

          return _res( [configFilePath, data] );

        } );
      } );

    } );
  }

  /**
   * Returns an array with all the source files, or throws an exception.
   * @return { SourceFileModel[] | Error }
   */
  static async getAllSourceFiles() {

    try {
      const readConfigFileRes = await ConfigFileAccess.readConfigFile();
      /** @type { ConfigFileModel } */
      const configFile = JSON.parse( readConfigFileRes[1] );
      return configFile.sourceFiles;

    } catch ( e ) {
      throw e;
    }
  }

  /**
   * Finds the config file and returns a SourceFileModel instance, or <null> in case in does not finds it.
   * 
   * @param { string } sourceFilePath
   * 
   * @returns { SourceFileModel | null }
   */
  static async getSourceFile( sourceFilePath ) {
  /** @type { SourceFileModel[] } */
    const allSourceFiles = await ConfigFileAccess.getAllSourceFiles();

    for ( let i = 0; i < allSourceFiles.length; ++i ) {
      if ( allSourceFiles[i].source === sourceFilePath ) {
        return allSourceFiles[i];
      }
    }

    return null;
  }

  static editConfigKey( key, value, Callback ) {
    ConfigFileAccess.readConfigFile( ( err, configFilePath, data ) => {
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
  }

  /**
   * It adds the new SourceFile(Model) into the merger-config.json file.
   * 
   * @param { SourceFileModel } newSourceFile SourceFile model.
   * @param { Function } Callback Optional.Called when the config file editing ends.
   * 
   * @returns { Promise<void> } void
   */
  static addFileToConfig( newSourceFile, Callback ) {
    return new Promise( ( _resolve, _reject ) => {

      ConfigFileAccess.readConfigFile( ( err, configFilePath, data ) => {
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
            return Callback();

          return _reject();
        } );
      } );

    } );
  }

  static removeSourceFile( sourceFileObject, Callback ) {
    ConfigFileAccess.readConfigFile( ( err, configFilePath, data ) => {
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
  }

  /**
   * It adds a new property and value to the merger-config.json file.
   * VALUE is optional if KEY is a Dictionary of key/value par dictionaries.
   * 
   * @param { string | Dictionary } key Config property. < string | Dictionary<string, any> >
   * @param { any } value  Config property value. (Optional if the "key" property is a dictionary)
   * @param { Function } Callback (Optional) Called when the config file editing ends.
   * 
   * @returns { Promise<void|Error> } void
   */
  static addProperty( key, value, Callback ) {
    return new Promise( ( _resolve, _reject ) => {
      try {
        ConfigFileAccess.readConfigFile( ( err, configFilePath, data ) => {
          if ( err ) {
            console.error( err );
            return _reject( err );
          }

          const userConfig = JSON.parse( data );

          if ( key instanceof Dictionary ) {
            key.__forEach( ( keyValueObj ) => {
              userConfig[Object.keys( keyValueObj )[0]] = Object.values( keyValueObj )[0];
            } );

          } else {
            userConfig[key] = value;
          }

          writeConfigFile( path.dirname( configFilePath ), 'merger-config', userConfig, ( err, data ) => {
            if ( err ) {
              console.error( err );
              return _reject( err );
            }

            if ( Callback )
              return Callback();

            return _resolve();
          } );
        } );

      } catch ( e ) {
        return _reject( e );
      }
    } );
  }

}

module.exports = ConfigFileAccess;
