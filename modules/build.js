'use strict'
const fs = require('fs');
const path = require('path');
const async = require('../node_modules/neo-async');
const parseImports = require('./parseImports');
const minifyCode = require('./minifyCode');
const notify = require('./notifications').notif;
const style = require('./consoleStyling');
const newTimestamp = require('./newTimestamp').small;
const buildOnChanges = 'Ready to build. Listening for file changes...';

const build = (sourceFile, buildOrder) => {
  let allData = {};

  // Read all the data from each file (with file names):
  async.eachSeries(buildOrder, (file, callback) => {
    fs.readFile(path.join(path.dirname(sourceFile.source), file), 'utf-8', (err, data) => {
      if (err) return callback(err);

      allData[file] = data;
      callback();
    });
  }, (err) => {
    if (err) throw err;

    // Minify if necessary:
    minifyCode(allData, (data) => {
      const buildPath = sourceFile.output.path;
      const buildName = sourceFile.output.name;

      fs.writeFile(path.join(buildPath, buildName), data, 'utf-8', (err) => {
        if (err) {
          // If the dir does not exist make a new dir.
          if (err.code === 'ENOENT') {
            fs.mkdir(buildPath, (err) => {
              if (err) return console.erro(style.styledError, err);
              fs.writeFile(path.join(buildPath, buildName), data, 'utf-8', (err) => {
                if (err) return console.error(style.styledError, err);
              });
            });
          } else {
            return console.error(style.ERROR, err);
          }
        }

        let timestamp = newTimestamp();
        let notifMessage = timestamp;
        if (global.config.autoBuild) {
          notifMessage += `\n${buildOnChanges}`;
          console.info(`\n ${buildOnChanges}\n`);
        }
        notify('Build Complete.', notifMessage);
        console.info('\n', timestamp, '-', style.successText('Build complete.'));
        console.timeEnd(' Build Time');
      });
    });
  });
}

module.exports = (sourceFile, buildOrder) => {
  console.time(' Build Time');
  console.info(' Building...');

  if (!buildOrder) {
    parseImports(sourceFile.source, (redefinedBuldOrder) => {
      build(sourceFile, redefinedBuldOrder);
    });
  } else {
    build(sourceFile, buildOrder);
  }
}
