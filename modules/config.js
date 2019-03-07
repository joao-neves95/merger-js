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
const editConfigFile = require( './CLIModules/editConfigFile' );
const Dictionary = require( 'js.system.collections' ).Dictionary;
const newTimestamp = require( './newTimestamp' );
const configKeys = require( '../models/configKeysEnum' );
const style = require('./consoleStyling');

module.exports = ( newConfig, Callback ) => {
  const propertiesToAdd = new Dictionary();

  try {
    findFile( 'merger-config.json', async ( err, configPath ) => {
      try {

        // Get the contents from the correct config file and store its content on a global:
        global.config = require( configPath );
        global.config.mergerConfigPath = configPath;

        // If the file is not present on the config, try to find the node_modules folder path and save it.
        if ( global.config.nodeModulesPath === null || global.config.nodeModulesPath === undefined ) {

          findFile( 'node_modules', async ( err, npmModulesPath ) => {
            if ( npmModulesPath !== false ) {
              global.config.nodeModulesPath = npmModulesPath;
              propertiesToAdd.add( 'nodeModulesPath', npmModulesPath );
            }

          } );
        }

        // #region UPDATE

        if ( global.config.updateOnLaunch !== null && global.config.updateOnLaunch !== undefined ) {
          // CHECK FOR UPDATES ON LAUNCH, IF NEEDED.
          if ( global.config.updateOnLaunch ) {
            try {
              await checkForUpdates();
              propertiesToAdd.add( configKeys.lastUpdateCheck, newTimestamp.complete() );

            } catch ( e ) {
              // Continue;
            }

          // CHECK FOR UPDATES ONCE A WEEK.
          } else {
            if ( global.config.lastUpdateCheck !== null || global.config.lastUpdateCheck !== undefined ) {
              if ( new Date( global.config.lastUpdateCheck ) >= newTimestamp.addDaysToDate( global.config.lastUpdateCheck, 7 ) ) {
                try {
                  await checkForUpdates();
                  propertiesToAdd.add( configKeys.lastUpdateCheck, newTimestamp.complete() );

                } catch ( e ) {
                  // Continue;
                }
              }
            }
          }

        // This was add in order to not add breaking changes.
        } else {
          // Set to true by default.
          global.config.updateOnLaunch = true;
          propertiesToAdd.add( configKeys.updateOnLaunch, true );
          try {
            await checkForUpdates();
            propertiesToAdd.add( configKeys.lastUpdateCheck, newTimestamp.complete() );

          } catch ( e ) {
            // Continue;
          }
        }

        // #endregion

        // Update glabal configurations set during the CLI launch.
        if ( newConfig.autoBuild !== null && newConfig.autoBuild !== undefined )
          global.config.autoBuild = newConfig.autoBuild;

        global.minifyOptions = {
          warnings: true
        };

        await editConfigFile.addProperty( propertiesToAdd );
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
