#!/usr/bin/env node
'use strict'
const path = require('path');
const chokidar = require('chokidar');
const mergerCLI = require('./modules/mergerCLI');
const config = require('./modules/config');
const selectSourceFile = require('./modules/CLIModules/selectSourceFilePrompt');
const parseImports = require('./modules/parseImports');
const build = require('./modules/build');

// PROGRAM:
mergerCLI((newConfig) => {
  config(newConfig, () => {
    selectSourceFile((sourceFile) => {
      parseImports(sourceFile.source, (buildOrder) => {
        // Auto builds:
        if (global.config.autoBuild) {
          let whatcher = chokidar.watch(buildOrder, { persistent: true, cwd: path.dirname(sourceFile.source) });
          whatcher
            .on('ready', () => {
              console.info(' Inicial scan complete. Ready to build on changes...');
              build(sourceFile, buildOrder);
            })
            .on('error', err => console.error('Auto build error: ', err))
            .on('change', (path, stats) => {
              // if (stats)
              //  console.info(`File ${path} as changed. Ready to build.\nStats: `, stats);
              build(sourceFile, null);
            });
        // One time builds:
        } else {
          build(sourceFile, buildOrder);
        }
      })
    });
  });
});
// End of PROGRAM.
