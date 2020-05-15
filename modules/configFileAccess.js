/*
 * Copyright (c) 2018-2020 João Pedro Martins Neves - All Rights Reserved.
 *
 * MergerJS (merger-js) is licensed under the MIT license, located in
 * the root of this project, under the name "LICENSE.md".
 *
 */

'use strict';
const fs = require( 'fs' );
const path = require( 'path' );
const Utils = require( './utils' );
const writeConfigFile = require( './utils' ).writeJSONFile;
const findFileOrDir = require( './utils' ).findFileOrDir;
const StaticClass = require( '../models/staticClassBase' );
const Dictionary = require( 'js.system.collections' ).Dictionary;
const style = require( './consoleStyling' );
const newTimestamp = require( './newTimestamp' ).small;
const UserConfigModel = require( '../models/userConfigModel' );
const SourceFileModel = require( '../models/sourceFileModel' );

/** (static) */
class ConfigFileAccess extends StaticClass {

  constructor() {
    super( ConfigFileAccess.name );
  }

  /**
   * Searches for the config file from the current directory and returns
   * a promise with [ configFilePath, data ] or an exception.
   * 
   * @returns { string[] | null }
   */
  static readConfigFile() {
    try {
      let configFilePath;

      if ( !Utils.isNullOrEmptyStr( global.config ) && !Utils.isNullOrEmptyStr( global.config.mergerConfigPath ) ) {
        configFilePath = global.config.mergerConfigPath;

      } else {
        configFilePath = findFileOrDir( 'merger-config.json' );
      }

      return [configFilePath, fs.readFileSync( configFilePath, 'utf8' )];

    } catch ( e ) {
      return console.error( style.styledError, e );
    }
  }

  static getNodeModulesPath() {
      try {

        if ( !Utils.isNullOrEmptyStr( global.config ) && !Utils.isNullOrEmptyStr( global.config.nodeModulesPath ) ) {
          return global.config.mergerConfigPath;

        } else {
          return findFileOrDir( 'node_modules' );
        }

      } catch ( e ) {
        return console.error( style.styledError, e );
      }
  }

  static editConfigKey( key, value ) {
    try {
      const configFileData = ConfigFileAccess.readConfigFile();
      const userConfig = JSON.parse( configFileData[1] );
      userConfig[key] = value;

      writeConfigFile( path.dirname( configFileData[0] ), 'merger-config', userConfig );
      return console.info( `\n ${newTimestamp()} - ${style.successText( 'Update to the merger-config file successful.' )}\n`, JSON.stringify( userConfig, null, '\t' ) );

    } catch ( e ) {
      return console.error( style.styledError, e );
    }
  }

  /**
   * It adds the new SourceFile(Model) into the merger-config.json file.
   * 
   * @param { SourceFileModel } newSourceFile SourceFile model.
   * 
   * @returns { void } void
   */
  static addFileToConfig( newSourceFile ) {
    try {
      const configFileData = ConfigFileAccess.readConfigFile();
      const userConfig = JSON.parse( configFileData[1] );
      userConfig.sourceFiles.push( newSourceFile );

      writeConfigFile( path.dirname( configFileData[0] ), 'merger-config', userConfig );
      console.info(
        `\n ${newTimestamp()} - ${style.successText( 'Successsfuly added the new source file to the MergerJS configuration file.' )}\n`,
        JSON.stringify( userConfig, null, '\t' )
      );

    } catch ( e ) {
      return console.error( style.styledError, e );
    }
  }

  /**
   * 
   * @param { SourceFileModel[] } sourceFileObjects
   */
  static removeSourceFile( sourceFileObjects ) {

    const searchFileIndex = ( userConfig, sourceFileObject ) => {
      for ( let i = 0; i < userConfig.sourceFiles.length; ++i ) {
        if ( JSON.stringify( userConfig.sourceFiles[i] ) === JSON.stringify( sourceFileObject ) ) {
          return i;
        }
      }

      return -1;
    };

    if ( !Array.isArray( sourceFileObjects ) ) {
      sourceFileObjects = [sourceFileObjects];
    }

    try {
      const configFileData = ConfigFileAccess.readConfigFile();

      /** @type { UserConfigModel } */
      const userConfig = JSON.parse( configFileData[1] );

      let fileIndex;
      for ( let i = 0; i < sourceFileObjects.length; ++i ) {
        fileIndex = searchFileIndex( userConfig, sourceFileObjects[i] );

        if ( fileIndex === -1 ) {
          return console.error( style.styledError, `Soruce file "${sourceFileObjects[i].source}" not found.` );
        }

        userConfig.sourceFiles.splice( fileIndex, 1 );
      }

      writeConfigFile( path.dirname( configFileData[0] ), 'merger-config', userConfig );
      console.info(
        `\n ${newTimestamp()} - ${style.successText( 'Successsfuly removed the source file from the MergerJS configuration file.' )}\n`,
        JSON.stringify( userConfig, null, '\t' )
      );

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
   * 
   * @returns { <void|Error> } void or logs the exception
   */
  static addProperty( key, value ) {
    try {
      const configFileData = ConfigFileAccess.readConfigFile();
      const userConfig = JSON.parse( configFileData[1] );

      if ( key instanceof Dictionary ) {
        key.__forEach( ( keyValueObj ) => {
          userConfig[Object.keys( keyValueObj )[0]] = Object.values( keyValueObj )[0];
        } );

      } else {
        userConfig[key] = value;
      }

      writeConfigFile( path.dirname( configFileData[0] ), 'merger-config', userConfig );

    } catch ( e ) {
      return console.error( style.styledError, e );
    }
  }

  static fixPaths() {
    try {
      /** @type { UserConfigModel } */
      const configFileData = JSON.parse( ConfigFileAccess.readConfigFile()[1] );

      let newRootPath = findFileOrDir( 'merger-config.json' );
      global.config.mergerConfigPath = newRootPath;
      newRootPath = path.dirname( newRootPath );

      const oldRootPath = path.dirname( configFileData.nodeModulesPath );

      configFileData.nodeModulesPath = ConfigFileAccess.____private().fixPath(
        newRootPath, oldRootPath, configFileData.nodeModulesPath
      );

      if ( configFileData.sourceFiles.length === 0 ) {
        return;
      }

      for ( let i = 0; i < configFileData.sourceFiles.length; ++i ) {
        configFileData.sourceFiles[i].source = ConfigFileAccess.____private().fixPath(
          newRootPath, oldRootPath, configFileData.sourceFiles[i].source
        );

        configFileData.sourceFiles[i].output.path = ConfigFileAccess.____private().fixPath(
          newRootPath, oldRootPath, configFileData.sourceFiles[i].output.path
        );
      }

      writeConfigFile( newRootPath, 'merger-config', configFileData );
      return true;

    } catch ( e ) {
      return false;
    }
  }

  static ____private() {
    return {

      /**
        *  @param { string } newRootPath
        *  @param { string } oldRootPath
        *  @param { string } pathToFix
        */
      fixPath: ( newRootPath, oldRootPath, pathToFix ) => {
        return pathToFix.replace( oldRootPath, newRootPath );
      }
    };
  }

}

module.exports = ConfigFileAccess;
