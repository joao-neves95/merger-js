'use strict'
const path = require('path');
const checkForUpdates = require('./checkForUpdates');
const findConfigFile = require('./findConfigFile');
const style = require('./consoleStyling');

module.exports = (Callback) => {
  // CONFIGURATIONS:
  checkForUpdates(() => {
    findConfigFile((configPath) => {
      try {
        // Get the contents from the correct config file and store its content on a global:
        global.config = require(configPath);

        global.minifyOptions = {
          warnings: true
        }

        Callback();
      } catch (e) {
        if (e.code === 'MODULE_NOT_FOUND')
          return console.error(` ${style.styledError} merger-config file not found. Please run "merger init".`);

        return console.error(style.styledError, e);
      }
    });
  });
  // End of CONFIGURATIONS:
}
