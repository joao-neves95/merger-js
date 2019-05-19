/*
 * Copyright (c) 2018-2019 João Pedro Martins Neves - All Rights Reserved.
 *
 * MergerJS (merger-js) is licensed under the MIT license, located in
 * the root of this project, under the name "LICENSE.md".
 *
 */

'use strict';
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
