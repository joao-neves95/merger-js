'use strict'
const fs = require('fs');
const path = require('path');
const writeConfigFile = require('../utils').writeJSONFile;
const newTimestamp = require('../newTimestamp').small;

module.exports = {
  editConfigKey: (key, value, Callback) => {
    const PATH = path.join(process.cwd(), 'merger-config.json');

    fs.readFile(PATH, (err, data) => {
      if (err)
        return console.error(err);

      let userConfig
      try {
        userConfig = JSON.parse(data);
        userConfig[key] = value;
      } catch (e) {
        return console.error(err);
      }

      writeConfigFile(path.dirname(PATH), 'merger-config', userConfig, (err, data) => {
        if (err)
          return console.error(err);

        let timestamp = newTimestamp();
        console.info(`\n ${timestamp} - Update to the merger-config file successful.\n`, data);

        if (Callback)
          Callback();
      });
    });
  },

  addFileToConfig: (newBuildFile, Callback) => {
    
  }
}
