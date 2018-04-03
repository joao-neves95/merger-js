'use strict'
const uglify = require('uglify-es');

module.exports = (code, callback) => {
  if (global.config.uglify) {
    let minifiedCode = uglify.minify(code, global.minifyOptions);
    if (minifiedCode.error) {
      return console.error('Error: ', minifiedCode.error);
    }
    if (global.minifyOptions.warnings && minifiedCode.warnings)
      console.warn('\n Warnings: \n ', minifiedCode.warnings);
    return callback(minifiedCode.code);
  }
  return callback(code);
}
