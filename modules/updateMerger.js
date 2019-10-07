﻿/*
 * Copyright (c) 2018-2019 João Pedro Martins Neves - All Rights Reserved.
 *
 * MergerJS (merger-js) is licensed under the MIT license, located in
 * the root of this project, under the name "LICENSE.md".
 *
 */

const spawn = require( 'child_process' ).spawn;
const notify = require('./notifications').notif;
const style = require('./consoleStyling');
const newTimestamp = require('./newTimestamp').small;

module.exports = ( cmd, Callback ) => {
  return new Promise( ( _resolve, _reject ) => {

    let hasErrors = false;

    let command = 'npm';
    // The 'win64' value is just in case Node.js changes in the future.
    if ( process.platform === 'win32' || process.platform === 'win64' ) {
      command += '.cmd';
    }

    let params = [ 'install', 'merger-js' ];
    if ( !cmd.local )
      params.push( '-g' );

    const proc = spawn( command, params );

    console.info( `${command} ${params.join( ' ' )}` );

    proc.stdout.on( 'data', ( data ) => {
      console.log( data.toString() );
    } );

    proc.stderr.on( 'data', ( data ) => {
      __handleError( data.toString() );
    } );

    proc.on( 'error', ( err ) => {
      __handleError( err );
    } );

    proc.on( 'close', ( code ) => {
      if ( hasErrors ) {
        console.error( ' It was not possible to update MergerJS. Please, try again.' );
        return _reject();
      }

      const timestamp = newTimestamp();
      console.info( ` ${timestamp} - ${style.successText( 'Update successful.' )}\n You can read the CHANGELOG file at https://github.com/joao-neves95/merger-js/blob/master/CHANGELOG.md. \n You can read the README file at https://github.com/joao-neves95/merger-js/blob/master/README.md. ` );
      notify( 'Update successful.', 'You can read the CHANGELOG file at https://github.com/joao-neves95/merger-js/blob/master/CHANGELOG.md. \nYou can read the README file at https://github.com/joao-neves95/merger-js/blob/master/README.md.' );

      if ( Callback )
        return Callback();

      return _resolve();
    } );

    const __handleError = ( error ) => {
      console.log( error );
      hasErrors = true;
    };

  } );
};
