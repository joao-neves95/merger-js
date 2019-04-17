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
const ConfigKeysType = require( '../models/configKeysEnum' );
const style = require('./consoleStyling');

module.exports = ( newConfig, Callback ) => {
  const propertiesToAdd = new Dictionary();

  try {
    findFile( 'merger-config.json', async ( err, configPath ) => {
      // Get the contents from the correct config file and store its content on a global:
      global.config = require( configPath );
      global.config.mergerConfigPath = configPath;

      // If the node_modules's path is not present on the config, try to find it and save it.
      if ( global.config.nodeModulesPath === null ||
           global.config.nodeModulesPath === undefined ||
           global.config.nodeModulesPath === "" )
      {
        findFile( 'node_modules', async ( err, npmModulesPath ) => {
          if ( npmModulesPath !== false ) {
            global.config.nodeModulesPath = npmModulesPath;
            propertiesToAdd.add( ConfigKeysType.nodeModulesPath, npmModulesPath );
          }
        } );
      }

      // #region INITIAL UPDATE SYSTEM

      if ( global.config.updateOnLaunch !== null && global.config.updateOnLaunch !== undefined && global.config.lastUpdateCheck !== "" ) {
        // CHECK FOR UPDATES ON LAUNCH, IF NEEDED.
        if ( global.config.updateOnLaunch )
          await ____checkForUpdatesAsync( propertiesToAdd );

        // CHECK FOR UPDATES ONCE A WEEK.
        else {
          if ( global.config.lastUpdateCheck !== null && global.config.lastUpdateCheck !== undefined && global.config.lastUpdateCheck !== "" ) {
            if ( new Date( global.config.lastUpdateCheck ) >= newTimestamp.addDaysToDate( global.config.lastUpdateCheck, 7 ) )
              await ____checkForUpdatesAsync( propertiesToAdd );
          }
        }

      // TODO: Remove on v4, along with all other methods of not adding breaking changes (if there is one).
      // This was add in order to not add breaking changes.
      } else {
        // Set to true by default.
        global.config.updateOnLaunch = true;
        propertiesToAdd.add( ConfigKeysType.updateOnLaunch, true );
        await ____checkForUpdatesAsync( propertiesToAdd );
      }

      // #endregion

      // Update glabal configurations set during the CLI launch.
      if ( newConfig.autoBuild !== null && newConfig.autoBuild !== undefined )
        global.config.autoBuild = newConfig.autoBuild;

      global.minifyOptions = {
        warnings: true
      };

      await editConfigFile.addProperty( propertiesToAdd );
      return Callback();
    } );

  } catch ( e ) {
    return ____returnError( e );
  }
};

const ____checkForUpdatesAsync = async ( propertiesToAdd ) => {
  try {
    await checkForUpdates();
    propertiesToAdd.add( ConfigKeysType.lastUpdateCheck, newTimestamp.completeLocale() );

  } catch ( e ) {
    // continue;
  }
};

const ____returnError = ( e ) => {
  if ( e.code === 'MODULE_NOT_FOUND' ) {
    console.error( ` ${style.styledError} merger-config.json file not found. Please run "merger init".` );
    process.exit( 1 );
    process.kill( process.pid, 'SIGINT' );

  } else if ( e.code === 'ENOTFOUND' )
    return;

  return console.error( style.styledError, e );
};
