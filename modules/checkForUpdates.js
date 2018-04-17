const http = require('http');
const notify = require('./notifications').notif;

module.exports = (Callback) => {
  console.info('\n ==================================================================================================================\n');
  console.info('\n IMPORTANT NOTICE: There will be a new (final) v3 of MergerJS with breaking changes in the future.\n For more info, please read the README.md at https://github.com/joao-neves95/merger-js/blob/master/README.md.');
  console.info('\n ==================================================================================================================\n');

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

