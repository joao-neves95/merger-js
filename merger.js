#!/usr/bin/env node

/*
 * Copyright (c) 2018-2020 João Pedro Martins Neves - All Rights Reserved.
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

// #region PROGRAM

mergerCLI( async ( newConfig ) => {
  await Config.init( newConfig );
  let sourceFiles = await selectSourceFile();

  // If "sourceFiles" is Array it means that the user chose the "All" (sourceFiles) option in selectSourceFile().
  if ( Array.isArray( sourceFiles ) ) {
    // Execute a one time build only.
    global.config.autoBuild = false;

  } else {
    sourceFiles = [sourceFiles];
  }

  async.eachSeries( sourceFiles, async ( sourceFile, Callback ) => {
    await Config.setCustomConfig( sourceFile.source );
    const buildOrder = await parseImports( sourceFile.source );

    // Execute one time builds:
    if ( !global.config.autoBuild ) {
      await build( sourceFile, buildOrder );
      return Callback();

      // Execute an auto build session (with file watcher):
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

// #endregion
