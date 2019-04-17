/*
 * Copyright (c) 2018-2019 João Pedro Martins Neves - All Rights Reserved.
 *
 * MergerJS (merger-js) is licensed under the MIT license, located in
 * the root of this project, under the name "LICENSE.md".
 *
 */

'use strict';
const CLI = require('../node_modules/commander');
const init = require('./CLIModules/init');
const update = require('./updateMerger');
const editConfigKey = require('./CLIModules/editConfigFile').editConfigKey;
const addFileToConfig = require('./CLIModules/editConfigFile').addFileToConfig;
const removeFileFromConfig = require('./CLIModules/editConfigFile').removeSourceFile;
const addFilesPrompt = require('./CLIModules/addFilesPrompt');
const selectSourceFile = require( './CLIModules/selectSourceFilePrompt' );
const EditConfigFile = require( './CLIModules/editConfigFile' );
const style = require('./consoleStyling');
const ConfigKeysType = require('../models/configKeysEnum');
global.version = require('../package.json').version;

module.exports = ( Callback ) => {
  global.config = {};
  let newConfig = {};

  // merger -v / --version
  CLI
    .version( global.version, '-v, --version' )
    .action( ( cmd ) => {
      process.exit( 0 );
    } );

  // merger init
  CLI
    .command( 'init' )
    .action( () => {
      return init();
    } );

  // merger auto
  CLI
    .command( 'auto' )
    .action( () => {
      newConfig.autoBuild = true;
      return Callback( newConfig );
    } );

  // merger update
  CLI
    .command( 'update' )
    .option( '-l, --local' )
    .action( ( cmd ) => {
      update( cmd, () => {
        process.exit( 0 );
      } );
    } );

  // merger build
  // merger build -a / --auto
  CLI
    .command( 'build' )
    .option( '-a, --auto' )
    .action( ( cmd ) => {
      if ( cmd.auto )
        newConfig.autoBuild = true;

      return Callback( newConfig );
    } );

  // merger set
  CLI
    .command( 'set <key>' )
    .option( '-t, --true' )
    .option( '-f, --false' )
    .action( ( key, cmd ) => {
      let Key = key.toUpperCase();
      let value;

      if ( cmd.true ) {
        value = true;
      } else if ( cmd.false ) {
        value = false;
      } else {
        console.error( ` ${style.styledError}${style.errorText( `Unknown option - ${cmd}.` )}` );
        process.exit( 1 );
      }

      switch ( Key ) {
        case 'MINIFY':
        case 'UGLIFY':
        case 'MNFY':
          Key = ConfigKeysType.minify;
          break;
        case 'AUTOBUILD':
        case 'AUTO':
          Key = ConfigKeysType.autoBuild;
          break;
        case 'NOTIFICATIONS':
        case 'NOTIFS':
        case 'NOTIFY':
        case 'NTFS':
          Key = ConfigKeysType.notifs;
          break;
        case 'UPDATEONLAUNCH':
        case 'UPDTONLNCH':
          Key = ConfigKeysType.updateOnLaunch;
          break;
        default:
          console.error( ` ${style.styledError}${style.errorText( `Unknown configuration key - ${key}.` )}` );
          process.exit( 1 );
          break;
      }

      editConfigKey( Key, value, () => {
        process.exit( 0 );
      } );
    } );

  // merger add
  CLI
    .command( 'add' )
    .action( () => {
      addFilesPrompt( ( newBuildFile ) => {
        addFileToConfig( newBuildFile, () => {
          process.exit( 0 );
        } );
      } );
    } );

  // merger rm
  CLI
    .command( 'rm' )
    .action( () => {
      selectSourceFile( sourceFileObject => {
        removeFileFromConfig( sourceFileObject, () => {
          process.exit( 0 );
        } );
      } );
    } );

  CLI
    .command( 'log' )
    .action( () => {
      EditConfigFile.readConfigFile( ( err, configFilePath, data ) => {
        console.log( `\n ${style.successText( 'Merger config file path:' )}`, configFilePath );
        console.log( `\n ${style.successText( 'Configuration File:\n' )}`, data );
      } );
    } );

  CLI.parse( process.argv );
  // If the user didn't use the CLI commands:
  // merger
  if ( process.argv.length <= 2 )
    return Callback( newConfig );
};
