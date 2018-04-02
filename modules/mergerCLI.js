﻿'use strict'
const CLI = require('commander');
const init = require('./init');

module.exports = (callback) => {
  // merger -v / --version
  CLI
    .version(global.version, '-v, --version')
    .action((cmd) => {
      process.exit(0);
    });

  // merger init
  CLI
    .command('init')
    .action(() => {
      return init();
      process.exit(0)
    })

  // merger auto
  CLI
    .command('auto')
    .action(() => {
      global.config.autoBuild = true;
      return callback();
    });

  // merger build
  // merger build -a / --auto
  CLI
    .command('build')
    .option('-a, --auto')
    .action((cmd) => {
      if (cmd.auto)
        global.config.autoBuild = true;

      return callback();
    });

  CLI.parse(process.argv);
  // If the user didn't use the CLI commands:
  // node merger
  if (process.argv.length <= 2)
    return callback();
}