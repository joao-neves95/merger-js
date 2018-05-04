'use strict'
const fs = require('fs');
const path = require('path');
const writeConfigFile = require('../utils').writeJSONFile;
const style = require('../consoleStyling');
const newTimestamp = require('../newTimestamp').small;

module.exports = {
  editConfigKey: (configPath, key, value, Callback) => {
    fs.readFile(configPath, (err, data) => {
      if (err)
        return console.error(err);

      let userConfig
      try {
        userConfig = JSON.parse(data);
        userConfig[key] = value;
      } catch (e) {
        return console.error(style.styledError, e);
      }

      writeConfigFile(path.dirname(configPath), 'merger-config', userConfig, (err, data) => {
        if (err)
          return console.error(err);

        let timestamp = newTimestamp();
        console.info(`\n ${timestamp} - ${style.successText('Update to the merger-config file successful.')}\n`, data);

        if (Callback)
          Callback();
      });
    });
  },

  addFileToConfig: (configPath, newSourceFile, Callback) => {
    fs.readFile(configPath, 'utf-8', (err, data) => {
      if (err)
        return console.error(style.styledError, err);

      let userConfig
      try {
        userConfig = JSON.parse(data);
        userConfig.sourceFiles.push(newSourceFile);
      } catch (e) {
        return console.error(style.styledError, e);
      }

      writeConfigFile(path.dirname(configPath), 'merger-config', userConfig, (err, data) => {
        if (err)
          return console.error(err);

        let timestamp = newTimestamp();
        console.info(`\n ${timestamp} - ${style.successText('Successsfuly added the new source file to the MergerJS configuration file successful.')}\n`, data);

        if (Callback)
          Callback();
      });
    });

  }
}
