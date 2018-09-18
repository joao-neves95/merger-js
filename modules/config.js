'use strict'
const checkForUpdates = require('./checkForUpdates');
const findFileOrDir = require('./findFileOrDir');
const style = require('./consoleStyling');

module.exports = (newConfig, Callback) => {
  // CONFIGURATIONS:
  checkForUpdates(() => {
    findFileOrDir( 'merger-config.json', ( configPath ) => {
      try {
        // Get the contents from the correct config file and store its content on a global:
        global.config = require(configPath);

        if (newConfig.autoBuild !== null && newConfig.autoBuild !== undefined)
          global.config.autoBuild = newConfig.autoBuild;

        global.minifyOptions = {
          warnings: true
        };

        try {
          findFileOrDir( 'node_modules', ( nodeModulesPath ) => {
            global.config.nodeModulesPath = nodeModulesPath;
          } );
        } catch ( e ) {
          console.log( '' );
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
