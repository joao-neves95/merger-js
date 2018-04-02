'use strict'
const path = require('path');

module.exports = (callback) => {
  if (global.isConfig)
    return;

  // CONFIGURATION:
  // Get the merger-config JSON file and store its content on a global:
  try {
    global.config = require(path.join(process.cwd(), './merger-config.json'));
    global.minifyOptions = {
      warnings: true
    }
    global.isConfig = true;
    callback();
  } catch (err) {
    if (err.code === 'MODULE_NOT_FOUND')
      return console.error('merger-config file not found. Please run "merger init" or "merger --help".');
  }
// End of CONFIGURATION:
}
