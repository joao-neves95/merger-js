/*
 * Copyright (c) 2018-2019 João Pedro Martins Neves - All Rights Reserved.
 *
 * MergerJS (merger-js) is licensed under the MIT license, located in
 * the root of this project, under the name "LICENSE.md".
 *
 */

'use strict';
const https = require('https');
const notify = require('./notifications').notif;
const style = require('./consoleStyling');
const UPDATE_ERROR = `\n ${style.warningTitle('Warn: ')} ${style.warningText('There was an error while checking for a MergerJS update.\n Please, check for updates manualy and if the problem persists, create an issue on GitHub.')}`;

/**
 * 
 * Updates MergerJS.
 * It returns true if the update was successfull, false if the update was not necessary or an Error in case of error.
 * 
 * @param { Function } Callback Optional. < boolean | Error >
 * @returns { Promise<boolean|Error> }
 */
module.exports = ( Callback ) => {
  return new Promise( ( _resolve, _reject ) => {
    console.info( ' Checking for updates... ' );
    try {

      https.get( 'https://skimdb.npmjs.com/registry/merger-js', ( res ) => {
        res.setEncoding( 'utf8' );
        let rawData = '';

        res.on( 'data', ( data ) => {
          rawData += data;
        } );

        res.on( 'end', () => {

          const parsedData = JSON.parse( rawData );
          const latestVersion = parsedData['dist-tags'].latest;

          if ( global.version !== latestVersion ) {
            // Different version.
            console.warn( `\n ${style.warningText( 'There is a newer version of MergerJS' )} \n Please, run "npm i merger-js -g" or "merger update" to update.\n ${global.version} -> ${latestVersion}\n\n CHANGELOG: https://github.com/joao-neves95/merger-js/blob/master/CHANGELOG.md \n` );
            notify( 'New version of MergerJS available.', `Please, run "merger update" to update.\n${global.version} -> ${latestVersion}` );

            if ( Callback ) return Callback( true );
            return _resolve( true );

          } else {
            console.info( style.successText( ' MergerJS is up to date.' ) );

            if ( Callback ) return Callback( false );
            return _resolve( true );
          }

        } );

      } ).on( 'error', ( e ) => {
        console.warn( UPDATE_ERROR );

        if ( Callback ) return Callback( e );
        return _reject( e );
      } );

    } catch ( e ) {
      console.warn( UPDATE_ERROR );

      if ( Callback ) return Callback( e );
      return _reject( e );
    }

  } );
};

