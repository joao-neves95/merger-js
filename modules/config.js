/*
 * Copyright (c) 2018-2019 João Pedro Martins Neves - All Rights Reserved.
 *
 * MergerJS (merger-js) is licensed under the MIT license, located in
 * the root of this project, under the name "LICENSE.md".
 *
 */

'use strict';
const checkForUpdates = require('./checkForUpdates');
const findFile = require( './utils' ).findFileOrDir;
const addPropertyToConfigFile = require( './CLIModules/editConfigFile' ).addProperty;
const Dictionary = require( './collections' ).Dictionary;
const style = require('./consoleStyling');

module.exports = ( newConfig, Callback ) => {
  const propertiesToAdd = new Dictionary();

  try {
    findFile( 'merger-config.json', async ( err, configPath ) => {
      try {

        // Get the contents from the correct config file and store its content on a global:
        global.config = require( configPath );
        global.config.mergerConfigPath = configPath;

        // Find the node_modules folder path and save it in merger-config.json if necessary.
        if ( global.config.nodeModulesPath === null || global.config.nodeModulesPath === undefined ) {

          findFile( 'node_modules', async ( err, npmModulesPath ) => {
            if ( npmModulesPath !== false ) {
              global.config.nodeModulesPath = npmModulesPath;
              propertiesToAdd.add( 'nodeModulesPath', npmModulesPath );
            }

          } );
        }

        // Update if needed.
        if ( global.config.updateOnLaunch !== null && global.config.updateOnLaunch !== undefined ) {
          if ( global.config.updateOnLaunch ) {
            try {
              await checkForUpdates();

            } catch ( e ) {
              // Continue;
            }
          }

          // This is to not add breaking changes.
        } else {
          // Set to true by default.
          propertiesToAdd.add( 'updateOnLaunch', true );
          try {
            await checkForUpdates();

          } catch ( e ) {
            // Continue;
          }
        }

        // Update glabal configurations set during the CLI launch.
        if ( newConfig.autoBuild !== null && newConfig.autoBuild !== undefined )
          global.config.autoBuild = newConfig.autoBuild;

        global.minifyOptions = {
          warnings: true
        };

        await addPropertyToConfigFile( propertiesToAdd );
        Callback();

      } catch ( e ) {
        return ____returnError( e );
      }

    } );

  } catch ( e ) {
    return ____returnError( e );
  }
};

const ____returnError = ( e ) => {
  if ( e.code === 'MODULE_NOT_FOUND' )
    return console.error( ` ${style.styledError} merger-config file not found. Please run "merger init".` );
  else if ( e.code === 'ENOTFOUND' )
    return;

  return console.error( style.styledError, e );
};
