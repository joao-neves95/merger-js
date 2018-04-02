'use strict'
const fs = require('fs');
const path = require('path');

module.exports = {
  readDir: (path, callback) => {
    fs.readdir(path, 'utf-8', (err, files) => {
      if (err)
        callback(err, null);
      else
        callback(null, files);
    });
  },

  writeJSONFile: (dir, fileName, data, callback) => {
    let jsonData = JSON.stringify(data, null, '\t');

    fs.writeFile(path.join(dir, fileName + '.json'), jsonData, 'utf8', (err) => {
      if (err)
        callback(err, null);
      else
        callback(null, jsonData);
    });
  }
}
