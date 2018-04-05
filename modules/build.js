'use strict'
const fs = require('fs');
const path = require('path');
const async = require('../node_modules/neo-async');
const minifyCode = require('./minifyCode');
const notify = require('./notifications').notif;
const newTimestamp = require('./newTimestamp').small;
const buildOnChanges = 'Ready to build. Listening for file changes...';

let allData = {};

module.exports = (buildOrder) => {
  console.time(' Build Time');
  console.info(' Building...');

  // Read all the data:
  async.eachSeries(buildOrder, (file, callback) => {
    fs.readFile(path.join(path.dirname(global.config.source), file), 'utf-8', (err, data) => {
      if (err) return callback(err);

      allData[file] = data;
      callback();
    })
  }, (err) => {
    if (err) throw err;

    // Minify if necessary:
    minifyCode(allData, (data) => {
      let buildPath = global.config.output.path;
      let buildName = global.config.output.name;
      fs.writeFile(path.join(buildPath, buildName), data, 'utf-8', (err) => {
        if (err) {
          // If the dir does not exist make a new dir.
          if (err.code === 'ENOENT') {
            fs.mkdir(buildPath, (err) => {
              if (err) return console.erro(err);
              fs.writeFile(path.join(buildPath, buildName), data, 'utf-8', (err) => {
                if (err) return console.error(err);
              });
            });
          } else {
            return console.error(err);
          }
        }

        allData = {}
        let timestamp = newTimestamp();
        let notifMessage = timestamp;
        if (global.config.autoBuild) {
          notifMessage += `\n${buildOnChanges}`;
          console.info(`\n ${buildOnChanges}\n`);
        }
        notify('Build Complete.', notifMessage);
        console.info('\n', timestamp, '- Build complete.');
        console.timeEnd(' Build Time');
      });
    });
  });
}
