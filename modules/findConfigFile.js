'use strict'
const path = require('path');
const readDir = require('./utils').readDir;
const whilst = require('../node_modules/neo-async').whilst;
const each = require('../node_modules/neo-async').each;
const style = require('./consoleStyling');

module.exports = (Callback) => {
  let currentDir = process.cwd();
  let foundFile = false;
  let lastDir;

  whilst(
    () => {
      let isToContinue;
      !currentDir ? isToContinue = false :
      (lastDir === currentDir) ? isToContinue = false :
      foundFile ? isToContinue = false :
        isToContinue = true;
      return isToContinue;
    },
    (whilstAgain) => {
      readDir(currentDir, (err, files) => {
        if (err)
          return console.error(style.styledError, err);

        each(files, (file, eachAgain) => {
          if (file === 'merger-config.json') {
            foundFile = true;
            return Callback(path.join(currentDir, file));
          } else {
            eachAgain();
          }
        }, (err) => {
          if (err)
            return console.error(style.styledError, err);

            lastDir = currentDir;
            currentDir = path.join(currentDir, '../');
            whilstAgain(null, null);
          }
        );
      });
    },
    (err, n) => {
      if (err)
        return console.error(style.styledError, err);
    }
  )
}
