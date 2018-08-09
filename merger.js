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
  config(newConfig, () => {
    selectSourceFile((sourceFile) => {
      let files = [sourceFile];
      let fileCount = 1;

      // If "sourceFile" is Array it means that the user chose the "All" (files) option in selectSourceFile().
      if (Array.isArray(sourceFile)) {
        files = sourceFile;
        fileCount = sourceFile.length;
        // One time builds.
        global.config.autoBuild = false;
      }

      async.eachSeries(files, (file, callback) => {

        parseImports(file.source, (buildOrder) => {
          // Auto builds:
          if (global.config.autoBuild) {
            let whatcher = chokidar.watch(buildOrder, { persistent: true, cwd: path.dirname(file.source) });
            whatcher
              .on('ready', () => {
                console.info(' Inicial scan complete. Ready to build on changes...');
                build(file, buildOrder);
              })
              .on('error', err => console.error('Auto build error: ', err))
              .on('change', (path, stats) => {
                // if (stats)
                //  console.info(`File ${path} as changed. Ready to build.\nStats: `, stats);
                build(file, null);
              });
            // One time build:
          } else {
            build(file, buildOrder);
          }
        });

        callback();
      }, (err) => {
          if (err) throw err;
      });

    });
  });
});
// End of PROGRAM.
