/*
 * Copyright (c) 2018-2020 João Pedro Martins Neves - All Rights Reserved.
 *
 * MergerJS (merger-js) is licensed under the
 * GPLv3.0 license (GNU General Public License v3.0),
 * located in the root of this project, under the name "LICENSE.md".
 */

'use strict';
const CLI = require('../node_modules/commander').program;
const init = require('./CLIModules/init');
const update = require('./updateMerger');
const addFilesPrompt = require('./CLIModules/addFilesPrompt');
const selectSourceFile = require( './CLIModules/selectSourceFilePrompt' );
const ConfigFileAccess = require( './configFileAccess' );
const style = require('./consoleStyling');
const ConfigKeysType = require('../enums/configKeysEnum');

module.exports = ( Callback ) => {
  global.version = require('../package.json').version;
  global.config = {};
  const newConfig = {};

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
    .action( async ( cmd ) => {
      try {
        await update( cmd );

      } catch ( e ) {
        console.error( e );
      }

      process.exit( 0 );
    } );

  // merger build
  // merger build -a / --auto
  CLI
    .command( 'build' )
    .option( '-a, --auto' )
    .action( ( cmd ) => {
      if ( cmd.auto ) {
        newConfig.autoBuild = true;
      }

      return Callback( newConfig );
    } );

  // merger set
  CLI
    .command( 'set <key>' )
    .description( 'run "merger set -h" for details' )
    .option( '-t, --true' )
    .option( '-f, --false' )
    .option( '-h', '--help' )
    .option( '-l', '--list' )
    .action( ( key, cmd ) => {
      let Key = key.toUpperCase();
      let value;

      if ( cmd.true ) {
        value = true;

      } else if ( cmd.false ) {
        value = false;

      } else if ( Key === 'HELP' || Key === 'LIST' || cmd.list || cmd.help ) {
        console.info( '\n Set MergerJS configuration.\n' );
        console.info( ' Configuration keys:' );
        console.info( ' -------------------' );
        const allConfigKeys = Object.values( ConfigKeysType );
        console.info( '', allConfigKeys.slice( 0, allConfigKeys.length - 2 ).join( '\n ' ) );
        console.info( '\n Possible values: "-t" and "--true" or "-f" and "--false"' );
        console.info( ' --------------- \n\n' );

        process.exit( 0 );

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

      ConfigFileAccess.editConfigKey( Key, value );
      process.exit( 0 );
    } );

  // merger add
  CLI
    .command( 'add' )
    .action( () => {
      addFilesPrompt( ( newBuildFile ) => {
        ConfigFileAccess.addFileToConfig( newBuildFile );
        process.exit( 0 );
      } );
    } );

  // merger rm
  CLI
    .command( 'rm' )
    .action( async () => {
      ConfigFileAccess.removeSourceFile( await selectSourceFile() );
      process.exit( 0 );
    } );

  CLI
    .command( 'fix-config-paths' )
    .action( () => {
      const success = ConfigFileAccess.fixPaths();

      if ( success ) {
        console.log( `\n ${style.successText( 'Config file paths fiexed successfully.' )}` );

      } else {
        console.error( ` ${style.styledError}${style.errorText( `There was an error while fixing the config file paths.` )}` );
      }

      process.exit( 0 );
    } );

  CLI
    .command( 'log' )
    .action( () => {
      const configFileData = ConfigFileAccess.readConfigFile();
      console.log( `\n ${style.successText( 'Merger config file path:' )}`, configFileData[0] );
      console.log( `\n ${style.successText( 'Configuration File:\n' )}`, configFileData[1] );
    } );

  // If the user didn't use the CLI commands:
  // merger
  if ( process.argv.length <= 2 ) {
    return Callback( newConfig );
  }

  CLI.parse( process.argv );
};
