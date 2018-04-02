'use strict'
const fs = require('fs');
const path = require('path');
const async = require('async');
const uglify = require('uglify-es');
const chokidar = require('chokidar')
const userConfig = require('../merger-config.json');

console.info('\n', userConfig, '\n');

// CONFIGURATIONS:
let autoBuild = false
if (userConfig.autoBuild)
  autoBuild = userConfig.autoBuild

let sourceDir = path.join(__dirname, '..');
if (userConfig.source && userConfig.source !== "")
  sourceDir = userConfig.source;

let buildDir = path.join(__dirname, '..');;
if (userConfig.output.path && userConfig.output.path !== "")
  buildDir = userConfig.output.path
else if (!userConfig.output.path && userConfig.source && userConfig.source !== "")
  buildDir = path.join(sourceDir, 'build');

let buildName = 'build.js';
if (userConfig.output.name && userConfig.output.name !== "")
  buildName = userConfig.output.name

let minify = false;
if (userConfig.uglify)
  minify = userConfig.uglify;

let minifyOptions = {
  warnings: true
}
if (userConfig.uglify.warnings)
  minifyOptions.warnings = minifyOptions.warnings;

let fileCount = userConfig.fileOrder.length
// End of CONFIGURATIONS:

// MODULES:
const log = message => console.log(message);

const minifyCode = (code, callback) => {
  if (minify) {
    let minifiedCode = uglify.minify(code, minifyOptions);
    if (minifiedCode.error) {
      return console.error('Error: ', minifiedCode.error);
    }
    if (minifyOptions.warnings && minifiedCode.warnings)
      console.warn('Warnings: \n', minifiedCode.warnings);
    return callback(minifiedCode.code);
  }
  return callback(code);
}

let allData = '';
const build = () => {
  console.time('Build Time');
  console.info('Building...');
  async.eachSeries(userConfig.fileOrder, (file, callback) => {
    fs.readFile(path.join(sourceDir, file), 'utf-8', (err, data) => {
      if (err) return callback(err);

      allData += data;
      callback();
    })
  }, (err) => {
    if (err) throw err;

    minifyCode(allData, (data) => {
      fs.writeFile(path.join(buildDir, buildName), data, 'utf-8', (err) => {
        if (err) {
          // If the dir does not exist make a new dir.
          if (err.code === 'ENOENT') {
            fs.mkdir(buildDir, (err) => {
              if (err) return console.erro(err);
              fs.writeFile(path.join(buildDir, buildName), data, 'utf-8', (err) => {
                if (err) return console.erro(err);
              });
            });
          } else {
            return console.error(err);
          }
        }

        allData = ''
        console.info('The build is complete.');
        console.timeEnd('Build Time');
      })
    })
  });
}
// End of MODULES:

// PROGRAM:
if (autoBuild) {
  let whatcher = chokidar.watch(userConfig.fileOrder, { persistent: true, cwd: sourceDir });
  whatcher
    .on('ready', () => {
      console.info('Inicial scan complete. Ready to build on changes...');
      build();
    })
    .on('error', err => console.error('Auto build error: ', err))
    .on('change', (path, stats) => {
      if (stats)
        console.info(`File ${path} as changed. Ready to build.\nStats ${stats}`);
      build();
    });

} else {
  build();
}
// End of PROGRAM:
