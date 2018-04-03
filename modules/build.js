'use strict'
const fs = require('fs');
const path = require('path');
const async = require('async');
const minifyCode = require('./minifyCode');

let allData = {};

module.exports = () => {
  console.time(' Build Time');
  console.info(' Building...');

  // Read all the data:
  async.eachSeries(global.config.fileOrder, (file, callback) => {
    fs.readFile(path.join(global.config.source, file), 'utf-8', (err, data) => {
      if (err) return callback(err);

      allData[file] = data;
      callback();
    })
  }, (err) => {
    if (err) throw err;

    // Minify if necessary:
    minifyCode(allData, (data) => {
      let buildPath = global.config.output.path;
      let buildName = global.config.output.name
      fs.writeFile(path.join(buildPath, buildName), data, 'utf-8', (err) => {
        if (err) {
          // If the dir does not exist make a new dir.
          if (err.code === 'ENOENT') {
            fs.mkdir(buildPath, (err) => {
              if (err) return console.erro(err);
              fs.writeFile(path.join(buildPath, buildName), data, 'utf-8', (err) => {
                if (err) return console.erro(err);
              });
            });
          } else {
            return console.error(err);
          }
        }

        allData = {}
        console.info('\n', new Date(), '- Build complete.');
        console.timeEnd(' Build Time');
        if (global.config.autoBuild)
          console.info('\n Ready to build.\n Listening for file changes...\n');
      })
    })
  });
}
