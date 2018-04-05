#!/usr/bin/env node
'use strict'
const fs = require('fs');
const path = require('path');
const chokidar = require('chokidar');
const mergerCLI = require('./modules/mergerCLI');
const config = require('./modules/config');
const parseImports = require('./modules/parseImports');
const build = require('./modules/build');

// PROGRAM:
mergerCLI(() => {
  config(() => {
    parseImports(global.config.source, (buildOrder) => {
      // Auto builds:
      if (global.config.autoBuild) {
        let whatcher = chokidar.watch(buildOrder, { persistent: true, cwd: path.dirname(global.config.source) });
        whatcher
          .on('ready', () => {
            console.info(' Inicial scan complete. Ready to build on changes...');
            build(buildOrder);
          })
          .on('error', err => console.error('Auto build error: ', err))
          .on('change', (path, stats) => {
            //if (stats)
            //  console.info(`File ${path} as changed. Ready to build.\nStats: `, stats);
            build(buildOrder);
          });
      // One time builds:
      } else {
        build(buildOrder);
      }
    })
  });
});
// End of PROGRAM.
