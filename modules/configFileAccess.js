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
   * Searches for the config file from the current directory and returns
   * a promise with [ configFilePath, data ] or an exception.
   * 
   * @returns { Promise<string[] | Error> }
   */
  static readConfigFile() {
    return new Promise( async ( _res, _rej ) => {

      try {
        const configFilePath = await findFileOrDir( 'merger-config.json' );
        return _res( [configFilePath, fs.readdirSync( configFilePath, 'utf8' )] );

      } catch ( e ) {
        return _rej( e );
      }

    } );
  }

  static editConfigKey( key, value ) {
    try {
      const configFileData = ConfigFileAccess.readConfigFile();
      let userConfig = JSON.parse( configFileData[1] );
      userConfig[key] = value;

      writeConfigFile( path.dirname( configFileData[0] ), 'merger-config', userConfig );
      return console.info( `\n ${newTimestamp()} - ${style.successText( 'Update to the merger-config file successful.' )}\n`, configFileData[1] );

    } catch ( e ) {
      return console.error( style.styledError, e );
    }
  }

  /**
   * It adds the new SourceFile(Model) into the merger-config.json file.
   * 
   * @param { SourceFileModel } newSourceFile SourceFile model.
   * 
   * @returns { Promise<void> } void
   */
  static addFileToConfig( newSourceFile ) {
    return new Promise( async ( _resolve, _reject ) => {

      try {
        const configFileData = ConfigFileAccess.readConfigFile();

        let userConfig = JSON.parse( configFileData[1] );
        userConfig.sourceFiles.push( newSourceFile );

        writeConfigFile( path.dirname( configFileData[0] ), 'merger-config', userConfig );
        console.info( `\n ${newTimestamp()} - ${style.successText( 'Successsfuly added the new source file to the MergerJS configuration file.' )}\n`, configFileData[1] );

      } catch ( e ) {
        return console.error( style.styledError, e );
      }
    } );
  }

  static removeSourceFile( sourceFileObject ) {
    try {
      const configFileData = ConfigFileAccess.readConfigFile();

      let userConfig = JSON.parse( configFileData[1] );

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
      
      writeConfigFile( path.dirname( configFilePath ), 'merger-config', userConfig );
      console.info( `\n ${newTimestamp()} - ${style.successText( 'Successsfuly removed the source file from the MergerJS configuration file.' )}\n`, configFileData[1] );

    } catch ( e ) {
      return console.error( style.styledError, e );
    }
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
