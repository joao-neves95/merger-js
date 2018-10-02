#!/usr/bin/env node
'use strict'
const path = require('path');
const chokidar = require('chokidar');
const mergerCLI = require('./modules/mergerCLI');
const config = require('./modules/config');
const selectSourceFile = require('./modules/CLIModules/selectSourceFilePrompt');
const async = require('./node_modules/neo-async');
const parseImports = require('./modules/parseImports');
const build = require('./modules/build');

// PROGRAM:
mergerCLI((newConfig) => {
  config( newConfig, () => {

    selectSourceFile((sourceFile) => {
      let files = [sourceFile];

      // If "sourceFile" is Array it means that the user chose the "All" (files) option in selectSourceFile().
      if (Array.isArray(sourceFile)) {
        files = sourceFile;
        // Execute a one time build only.
        global.config.autoBuild = false;
      }
      
      async.eachSeries( files, ( file, Callback ) => {

        parseImports(file.source, (buildOrder) => {
          // Execute one time builds:
          if ( !global.config.autoBuild )
            build( file, buildOrder );

          // Execute an auto builds (with file watcher):
          else {
            const whatcher = chokidar.watch( buildOrder, { persistent: true, cwd: path.dirname( file.source ) } );

            whatcher
              .on( 'ready', () => {
                console.info(' Inicial scan complete. Ready to build on changes...');
                build( file, buildOrder );
              })
              .on('error', err => console.error('Auto build error: ', err))
              .on( 'change', ( path, stats ) => {
                build(file, null);
            });
          }
        });

        Callback();

      }, (err) => {
          if (err) throw err;
      });

    });
  });
});
// End of PROGRAM.
