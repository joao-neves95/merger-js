#!/usr/bin/env node


/*
 * Copyright (c) 2018-2019 João Pedro Martins Neves - All Rights Reserved.
 *
 * MergerJS (merger-js) is licensed under the MIT license, located in
 * the root of this project, under the name "LICENSE.md".
 *
 */

'use strict';
const path = require('path');
const chokidar = require('chokidar');
const mergerCLI = require('./modules/mergerCLI');
const Config = require('./modules/config');
const async = require( './node_modules/neo-async' );
const selectSourceFile = require('./modules/CLIModules/selectSourceFilePrompt');
const parseImports = require( './modules/buildModules/parseImports' );
const build = require( './modules/buildModules/build' );
const SourceFileModel = require( './models/SourceFileModel' );
const SourceFileConfigBase = require( './models/sourceFileConfigBase' );
const Utils_isNullOrUndefined = require( './modules/utils' ).isNullOrUndefined;

// #region PROGRAM

mergerCLI( ( newConfig ) => {

  Config.init( newConfig, () => {

    selectSourceFile( ( sourceFile ) => {
      /** @type { SourceFileModel[] } */
      let files = [sourceFile];

      // If "sourceFile" is Array it means that the user chose the "All" (files) option in selectSourceFile().
      if ( Array.isArray( sourceFile ) ) {
        files = sourceFile;
        // Execute a one time build only.
        global.config.autoBuild = false;
      }

      async.eachSeries( files, async ( sourceFile, Callback ) => {
        const buildOrder = await parseImports( sourceFile.source );

        const customConfig = await Config.getCustomConfig( sourceFile[0] );
        if ( customConfig ) {
          if ( !Utils_isNullOrUndefined( customConfig.uglify ) ) {
            global.config.uglify = customConfig.uglify;
          }
        }

        // Execute one time builds:
        if ( !global.config.autoBuild ) {
          await build( sourceFile, buildOrder );
          return Callback();

        // Execute an auto builds (with file watcher):
        } else {
          const whatcher = chokidar.watch( buildOrder, { persistent: true, cwd: path.dirname( sourceFile.source ) } );

          whatcher
            .on( 'ready', async () => {
              console.info( ' Inicial scan complete. Ready to build on changes...' );
              await build( sourceFile, buildOrder );
              return Callback();
            } )
            .on( 'error', err => console.error( 'Auto build error: ', err ) )
            .on( 'change', async ( path, stats ) => {
              await build( sourceFile, null );
            } );
        }

      }, ( err ) => {
        if ( err ) throw err;
      } );

    } );
  } );
} );

// #endregion
