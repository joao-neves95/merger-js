﻿const exec = require('child_process').exec;
const notify = require('./notifications').notif;

module.exports = (cmd, Callback) => {
  let command = 'npm install merger-js';
  if (!cmd.local)
    command += ' -g';

  exec(command, (err, stdout, stderr) => {
    if (err)
      return console.error(' It was not possible to update MergerJS. Please, try again.');

    console.info(` ${command}`);
    console.log(`\n ${stdout}`);
    console.log(`\n ${stderr}`);

    notify('Update successful.', 'You can read the CHANGELOG file at https://github.com/joao-neves95/merger-js/blob/master/CHANGELOG.md. \nYou can read the README file at https://github.com/joao-neves95/merger-js/blob/master/README.md.');
    console.info(' Update successful.\n You can read the CHANGELOG file at https://github.com/joao-neves95/merger-js/blob/master/CHANGELOG.md. \n You can read the README file at https://github.com/joao-neves95/merger-js/blob/master/README.md.');
    Callback();
  });
}