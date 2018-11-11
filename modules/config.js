/*
 * Copyright (c) 2018 João Pedro Martins Neves - All Rights Reserved.
 *
 * MergerJS (merger-js) is licensed under the MIT license, located in
 * the root of this project, under the name "LICENSE.md".
 *
 */

'use strict';
const checkForUpdates = require('./checkForUpdates');
const findFile = require( './utils' ).findFileOrDir;
const addPropertyToConfigFile = require( './CLIModules/editConfigFile' ).addProperty;
const style = require('./consoleStyling');

module.exports = ( newConfig, Callback ) => {
  checkForUpdates( () => {

  // #region CONFIGURATIONS

    findFile( 'merger-config.json', ( err, configPath ) => {
      try {
        // Get the contents from the correct config file and store its content on a global:
        global.config = require( configPath );
        global.config.mergerConfigPath = configPath;

        if ( newConfig.autoBuild !== null && newConfig.autoBuild !== undefined )
          global.config.autoBuild = newConfig.autoBuild;

        global.minifyOptions = {
          warnings: true
        };

        try {
          // Find the node_modules folder path and save it in merger-config.json if necessary.
          if ( global.config.nodeModulesPath === null || global.config.nodeModulesPath === undefined ) {

            findFile( 'node_modules', ( err, npmModulesPath ) => {
              if ( npmModulesPath !== false ) {
                global.config.nodeModulesPath = npmModulesPath;
                addPropertyToConfigFile( 'nodeModulesPath', npmModulesPath );
              }

            } );

          }
        } catch ( e ) {
          console.log( '' );
        }

        Callback();

      } catch ( e ) {
        if ( e.code === 'MODULE_NOT_FOUND' )
          return console.error( ` ${style.styledError} merger-config file not found. Please run "merger init".` );

        return console.error( style.styledError, e );
      }
    } );
  } );

  // #endregion

};
