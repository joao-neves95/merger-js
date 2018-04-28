const chalk = require('chalk');

module.exports = {
  styledError: chalk.bold.black.bgRed('ERROR: '),
  errorTitle: chalk.bold.black.bgRed,
  errorText: chalk.red,
  warningTitle: chalk.bold.black.bgYellow,
  warningText: chalk.yellow,
  successTitle: chalk.bold.white.bgGreen,
  successText: chalk.green
}
