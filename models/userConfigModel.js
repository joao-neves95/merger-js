﻿/*
 * Copyright (c) 2018-2019 João Pedro Martins Neves - All Rights Reserved.
 *
 * MergerJS (merger-js) is licensed under the MIT license, located in
 * the root of this project, under the name "LICENSE.md".
 *
 */

'use strict';
const newTimestamp = require( '../modules/newTimestamp' ).completeLocale;

class UserConfig {
  constructor (uglify, autoBuild, notifications) {
    this.mergerJsLinks = {
      npm: 'https://www.npmjs.com/package/merger-js',
      github: 'https://github.com/joao-neves95/merger-js',
      readme: 'https://github.com/joao-neves95/merger-js/blob/master/README.md',
      changelog: 'https://github.com/joao-neves95/merger-js/blob/master/CHANGELOG.md'
    };

    this.uglify = uglify === undefined || uglify === null ? true : uglify;
    this.autoBuild = autoBuild === undefined || autoBuild === null ? false : autoBuild;
    this.notifications = notifications === undefined || notifications === null ? true : notifications;
    this.updateOnLaunch = true;
    this.lastUpdateCheck = newTimestamp();
    this.nodeModulesPath = "";
    this.sourceFiles = [];
  }
}

module.exports = UserConfig;
