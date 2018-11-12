#!/usr/bin/env node

/*
 * Copyright (c) 2018 João Pedro Martins Neves - All Rights Reserved.
 *
 * MergerJS (merger-js) is licensed under the MIT license, located in
 * the root of this project, under the name "LICENSE.md".
 *
 */

'use strict';
const path = require('path');
const chokidar = require('chokidar');
const mergerCLI = require('./modules/mergerCLI');
const config = require('./modules/config');
const async = require( './node_modules/neo-async' );
const selectSourceFile = require('./modules/CLIModules/selectSourceFilePrompt');
const parseImports = require( './modules/buildModules/parseImports' );
const build = require( './modules/buildModules/build' );
const sourceFileModel = require( './models/sourceFileModel' );

// #region PROGRAM

mergerCLI( ( newConfig ) => {
  config( newConfig, () => {

    selectSourceFile( ( sourceFile ) => {
      /** @type { sourceFileModel[] } */
      let files = [sourceFile];

      // If "sourceFile" is Array it means that the user chose the "All" (files) option in selectSourceFile().
      if (Array.isArray(sourceFile)) {
        files = sourceFile;
        // Execute a one time build only.
        global.config.autoBuild = false;
      }

      async.eachSeries( files, ( file, Callback ) => {

        parseImports( file.source, async ( buildOrder ) => {
          // Execute one time builds:
          if ( !global.config.autoBuild ) {
            await build( file, buildOrder );
            return Callback();
          }

          // Execute an auto builds (with file watcher):
          else {
            const whatcher = chokidar.watch( buildOrder, { persistent: true, cwd: path.dirname( file.source ) } );

            whatcher
              .on( 'ready', async () => {
                console.info( ' Inicial scan complete. Ready to build on changes...' );
                await build( file, buildOrder );
                return Callback();
              })
              .on('error', err => console.error('Auto build error: ', err))
              .on( 'change', async ( path, stats ) => {
                await build(file, null);
            });
          }
        });

      }, (err) => {
          if (err) throw err;
      });

    });
  });
} );

// #endregion
