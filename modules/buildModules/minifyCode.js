/*
 * Copyright (c) 2018-2019 João Pedro Martins Neves - All Rights Reserved.
 *
 * MergerJS (merger-js) is licensed under the MIT license, located in
 * the root of this project, under the name "LICENSE.md".
 *
 */

'use strict';
const uglify = require('uglify-es');
const notify = require('../notifications').notif;

module.exports = (allCode, callback) => {
  if (global.config.uglify) {
    let minifiedCode = uglify.minify(allCode, global.minifyOptions);
    if (minifiedCode.error) {
      let err = minifiedCode.error;
      notify(`Build error on the file ${err.filename}, line ${err.line}, col ${err.col}.`, err.message);
      return console.error(' Error:\n ', err);
    }
    if (global.minifyOptions.warnings && minifiedCode.warnings)
      console.warn('\n Warnings: \n ', minifiedCode.warnings);

    return callback(minifiedCode.code);
  } else {
    let nonMinifiedCode = '';
    for (let fileName in allCode) {
      nonMinifiedCode += allCode[fileName];
    }

    return callback(nonMinifiedCode);
  }
}
