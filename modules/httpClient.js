/*
 * Copyright (c) 2018-2020 João Pedro Martins Neves - All Rights Reserved.
 *
 * MergerJS (merger-js) is licensed under the MIT license, located in
 * the root of this project, under the name "LICENSE.md".
 *
 */

'use strict';
const https = require( 'https' );
const { IncomingMessage } = require( 'http' );
const StaticClass = require( '../models/staticClassBase' );

/**
 * Allways HTTPS.
 */
class HttpClient extends StaticClass {

  constructor() {
    super( HttpClient.name );
  }

  /**
   * Get HTTPS async.
   * It returns a Response object with the data in Response.body.
   * 
   * @param { string } url
   * @param { Function } Callback Optional callback that receives (error, data).
   * 
   * @returns { Promise<IncomingMessage | Error> }
   */
  static getAsync( url, Callback ) {
    return new Promise( ( resolve, reject ) => {

      try {
        https.get( url, { headers: { "User-Agent": `MergerJS/${global.version}` } }, ( res ) => {
          res.setEncoding( 'utf8' );
          res.body = '';

          res.on( 'data', ( resData ) => {
            res.body += resData;
          } );

          res.on( 'error', ( err ) => {
            reject(err);

            if (Callback) {
              return Callback( err, null );
            }
          } );

          res.on( 'end', () => {
            resolve( res );

            if (Callback) {
              return Callback( null, res );
            }
          } );
        } );

      } catch ( e ) {
        reject( e );

        if (Callback) {
          return Callback( e, null );
        }
      }

    } );
  }
}

module.exports = HttpClient;
