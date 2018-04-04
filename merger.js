#!/usr/bin/env node
'use strict'
const fs = require('fs');
const path = require('path');
const chokidar = require('chokidar');
const mergerCLI = require('./modules/mergerCLI');
const config = require('./modules/config');
const build = require('./modules/build');

// PROGRAM:
mergerCLI(() => {
  config(() => {
    // Auto builds:
    if (global.config.autoBuild) {
      let whatcher = chokidar.watch(global.config.fileOrder, { persistent: true, cwd: global.config.source });
      whatcher
        .on('ready', () => {
          console.info(' Inicial scan complete. Ready to build on changes...');
          build();
        })
        .on('error', err => console.error('Auto build error: ', err))
        .on('change', (path, stats) => {
          //if (stats)
          //  console.info(`File ${path} as changed. Ready to build.\nStats: `, stats);
          build();
        });
    // One time builds:
    } else {
      build();
    }
  });
});
// End of PROGRAM.
