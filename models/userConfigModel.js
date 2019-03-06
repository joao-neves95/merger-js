/*
 * Copyright (c) 2018-2019 João Pedro Martins Neves - All Rights Reserved.
 *
 * MergerJS (merger-js) is licensed under the MIT license, located in
 * the root of this project, under the name "LICENSE.md".
 *
 */

'use strict'

class UserConfig {
  constructor (uglify, autoBuild, notifications) {
    this.mergerJsLinks = {
      npm: 'https://www.npmjs.com/package/merger-js',
      github: 'https://github.com/joao-neves95/merger-js',
      readme: 'https://github.com/joao-neves95/merger-js/blob/master/README.md',
      changelog: 'https://github.com/joao-neves95/merger-js/blob/master/CHANGELOG.md'
    }
    this.uglify = uglify;
    this.autoBuild = autoBuild;
    this.notifications = notifications;
    this.sourceFiles = [];
  }
}

module.exports = UserConfig;
