﻿'use strict'
const CLI = require('../node_modules/commander');
const init = require('./init');
const update = require('./updateMerger');
const editConfigKey = require('./CLIModules/editConfigFile').editConfigKey;
const addFileToConfig = require('./CLIModules/editConfigFile').addFileToConfig;
const addFilesPrompt = require('./CLIModules/addFilesPrompt');
const findConfigFile = require('./findConfigFile');
global.version = require('../package.json').version;

module.exports = (callback) => {
  global.config = {}

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
      process.exit(0);
    })

  // merger auto
  CLI
    .command('auto')
    .action(() => {
      global.config.autoBuild = true;
      return callback();
    });

  // merger update
  CLI
    .command('update')
    .option('-l, --local')
    .action((cmd) => {
      update(cmd, () => {
        process.exit(0);
      });
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

  // merger set
  CLI
    .command('set <key>')
    .option('-t, --true')
    .option('-f, --false')
    .action((key, cmd) => {
      let Key = key.toUpperCase();
      let value

      if (cmd.true) {
        value = true
      } else if (cmd.false) {
        value = false
      } else {
        console.error(` ERROR: Unknown option - ${cmd}.`)
        process.exit(1);
      }

      if (Key === 'MINIFY' || Key === 'UGLIFY' || Key === 'MNFY') {
        Key = 'uglify';
      } else if (Key === "AUTOBUILD" || Key === 'AUTO') {
        Key = 'autoBuild';
      } else if (Key === "NOTIFICATIONS" || Key === "NOTIFS" || Key === "NTFS") {
        Key = 'notifications';
      } else {
        console.error(` ERROR: Unknown configuration key - ${key}.`);
      }

      editConfigKey(Key, value, () => {
        process.exit(0);
      });
    });

  // merger add
  CLI
    .command('add')
    .action(() => {
      addFilesPrompt((newBuildFile) => {
        addToConfig(
          process.exit(0)
        );
      })
    })

  // merger remove
  // TESTING
  CLI
    .command('test')
    .action(() => {
      findConfigFile((path) => {
        console.log(path);
        process.exit(0);
      });
    });

  CLI.parse(process.argv);
  // If the user didn't use the CLI commands:
  // merger
  if (process.argv.length <= 2)
    return callback();
}
