/*
 * Copyright (c) 2018-2020 João Pedro Martins Neves - All Rights Reserved.
 *
 * MergerJS (merger-js) is licensed under the MIT license, located in
 * the root of this project, under the name "LICENSE.md".
 *
 */

'use strict';
const https = require('https');
const HttpClient = require('./httpClient');
const notify = require('./notifications').notif;
const style = require('./consoleStyling');
const UPDATE_ERROR = `\n ${style.warningTitle('Warn: ')} ${style.warningText('There was an error while checking for a MergerJS update.\n Please, check for updates manualy and if the problem persists, create an issue on GitHub.')}`;

/**
 * 
 * Updates MergerJS.
 * It returns true if the update was successfull, false if the update was not necessary or an Error in case of error.
 * 
 * @returns { Promise<boolean|Error> }
 */
module.exports = async () => {
  console.info(' Checking for updates... ');

  try {
    const res = await HttpClient.getAsync('https://skimdb.npmjs.com/registry/merger-js');

    if (res.statusCode !== 200) {
      throw new Error(res.statusMessage);
    }

    const latestVersion = JSON.parse(res.body)['dist-tags'].latest;

    // Different version.
    if (global.version !== latestVersion) {

      console.warn(`\n ${style.warningText('There is a newer version of MergerJS')}\n
Please, run "npm i merger-js -g" or "merger update" to update.\n ${global.version} -> ${latestVersion}\n\n 
CHANGELOG: https://github.com/joao-neves95/merger-js/blob/master/CHANGELOG.md \n`);

      notify('New version of MergerJS available.', `Please, run "merger update" to update.\n${global.version} -> ${latestVersion}`);
      return true;

    } else {
      console.info(style.successText(' MergerJS is up to date.'));

      return false;
    }

  } catch (e) {
    // Fail.
    console.warn(UPDATE_ERROR);
    console.debug(e)
    return false;
  }
};

