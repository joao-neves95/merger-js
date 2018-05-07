const http = require('http');
const notify = require('./notifications').notif;
const style = require('./consoleStyling');

module.exports = (Callback) => {
  http.get('http://registry.npmjs.org/merger-js', (res) => {
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
          console.warn(`\n ${style.warningTitle('There is a newer version of MergerJS')} \n Please, run "npm i merger-js -g" to update.\n ${global.version} -> ${latestVersion }\n\n CHANGELOG: https://github.com/joao-neves95/merger-js/blob/master/CHANGELOG.md \n`);
          notify('New version of MergerJS available.', `Please, run "merger update" to update.\n${global.version} -> ${latestVersion}`);
          return Callback();
        } else {
          return Callback();
        }
      } catch (e) {
        return;
      }
    })
  }).on('error', (err) => {
    return;
  });
}

