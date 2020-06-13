#!/usr/bin/env node

/*
 * Copyright (c) 2018-2020 João Pedro Martins Neves - All Rights Reserved.
 *
 * MergerJS (merger-js) is licensed under the
 * GPLv3.0 license (GNU General Public License v3.0),
 * located in the root of this project, under the name "LICENSE.md".
 */

'use strict';
const mergerCLI = require('./modules/mergerCLI');
const Config = require('./modules/config');
const selectSourceFile = require('./modules/CLIModules/selectSourceFilePrompt');
const Compiler = require( './modules/buildModules/compiler' );

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

  for (let i = 0; i < sourceFiles.length; ++i) {
    Config.setCustomConfig( sourceFiles[i].source );
    await Compiler.run( sourceFiles[i] );
  }

} );

// #endregion
