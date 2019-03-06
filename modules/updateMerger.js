﻿/*
 * Copyright (c) 2018-2019 João Pedro Martins Neves - All Rights Reserved.
 *
 * MergerJS (merger-js) is licensed under the MIT license, located in
 * the root of this project, under the name "LICENSE.md".
 *
 */

const exec = require('child_process').exec;
const notify = require('./notifications').notif;
const style = require('./consoleStyling');
const newTimestamp = require('./newTimestamp').small;

module.exports = ( cmd, Callback ) => {
  return new Promise( ( _resolve, _reject ) => {

    let command = 'npm install merger-js';
    if ( !cmd.local )
      command += ' -g';

    exec( command, ( err, stdout, stderr ) => {
      if ( err )
        return console.error( ' It was not possible to update MergerJS. Please, try again.' );

      console.info( ` ${command}` );
      console.log( `\n ${stdout}` );
      console.log( `\n ${stderr}` );

      let timestamp = newTimestamp();
      console.info( ` ${timestamp} - ${style.successText( 'Update successful.' )}\n You can read the CHANGELOG file at https://github.com/joao-neves95/merger-js/blob/master/CHANGELOG.md. \n You can read the README file at https://github.com/joao-neves95/merger-js/blob/master/README.md. ` );
      notify( 'Update successful.', 'You can read the CHANGELOG file at https://github.com/joao-neves95/merger-js/blob/master/CHANGELOG.md. \nYou can read the README file at https://github.com/joao-neves95/merger-js/blob/master/README.md.' );

      if ( Callback )
        return Callback();

      return _resolve();
    } );
  } );
};
