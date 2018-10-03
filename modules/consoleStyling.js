'use strict'
const chalk = require('chalk');

module.exports = {
  styledError: chalk.bold.black.bgRed( 'ERROR: ' ),
  errorTitle: chalk.bold.black.bgRed,
  errorText: chalk.red,
  warningTitle: chalk.bgYellow.bold.black,
  warningText: chalk.yellow.bold,
  successTitle: chalk.bold.white.bgGreen,
  successText: chalk.green
};
