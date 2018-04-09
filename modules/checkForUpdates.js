const http = require('http');
const notify = require('./notifications').notif;

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
          console.warn(`\n There is a newer version of MergerJS.\n Please, run "merger update" to update.\n ${global.version} -> ${latestVersion}\n`);
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

