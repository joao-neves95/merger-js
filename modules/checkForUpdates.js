'use strict'
const https = require('https');
const notify = require('./notifications').notif;
const style = require('./consoleStyling');
const UPDATE_ERROR = `\n ${style.warningTitle('Warn: ')} ${style.warningText('There was an error while checking for a MergerJS update.\n Please, check for updates manualy and if the problem persists, create an issue on GitHub.')}`;

module.exports = (Callback) => {
  console.info(' Checking for updates... ');

  https.get('https://skimdb.npmjs.com/registry/merger-js', (res) => {
    res.setEncoding('utf8');
    let rawData = '';

    res.on('data', (data) => {
      rawData += data;
    });

    res.on('end', () => {
      try {
        const parsedData = JSON.parse(rawData);
        const latestVersion = parsedData['dist-tags'].latest;

        if (global.version !== latestVersion) {
          // Different version.
          console.warn(`\n ${ style.warningTitle('There is a newer version of MergerJS') } \n Please, run "npm i merger-js -g" or "merger update" to update.\n ${ global.version } -> ${ latestVersion }\n\n CHANGELOG: https://github.com/joao-neves95/merger-js/blob/master/CHANGELOG.md \n`);
          notify('New version of MergerJS available.', `Please, run "merger update" to update.\n${global.version} -> ${latestVersion}`);

          return Callback();
        } else {
          console.info(style.successText(' MergerJS is up to date.'));

          return Callback();
        }
      } catch (e) {
        console.warn(UPDATE_ERROR);

        return Callback();
      }
    })
  }).on('error', () => {
    console.warn(UPDATE_ERROR);

    return Callback();
  });
}

