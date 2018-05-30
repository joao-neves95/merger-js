'use strict'
const CLI = require('../node_modules/commander');
const init = require('./CLIModules/init');
const update = require('./updateMerger');
const editConfigKey = require('./CLIModules/editConfigFile').editConfigKey;
const addFileToConfig = require('./CLIModules/editConfigFile').addFileToConfig;
const addFilesPrompt = require('./CLIModules/addFilesPrompt');
const findConfigFile = require('./findConfigFile');
const style = require('./consoleStyling');
global.version = require('../package.json').version;

module.exports = (Callback) => {
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
    })

  // merger auto
  CLI
    .command('auto')
    .action(() => {
      global.config.autoBuild = true;
      return Callback();
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

      return Callback();
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
        console.error(` ${style.styledError}${style.errorText(`Unknown option - ${cmd}.`)}`);
        process.exit(1);
      }

      switch (Key) {
        case 'MINIFY':
        case 'UGLIFY':
        case 'MNFY':
          Key = 'uglify';
          break;
        case 'AUTOBUILD':
        case 'AUTO':
          Key = 'autoBuild';
          break;
        case 'NOTIFICATIONS':
        case 'NOTIFS':
        case 'NOTIFY':
        case 'NTFS':
          Key = 'notifications';
          break;
        default:
          console.error(` ${style.styledError}${style.errorText(`Unknown configuration key - ${key}.`)}`);
          process.exit(1);
          break;
      }

      findConfigFile((configPath) => {
        editConfigKey(configPath, Key, value, () => {
          process.exit(0);
        });
      });
    });

  // merger add
  CLI
    .command('add')
    .action(() => {
      findConfigFile((configPath) => {
        addFilesPrompt((newBuildFile) => {
          addFileToConfig(configPath, newBuildFile, () => {
            process.exit(0);
          });
        });
      });
    });

  // merger remove

  CLI.parse(process.argv);
  // If the user didn't use the CLI commands:
  // merger
  if (process.argv.length <= 2)
    return Callback();
}
