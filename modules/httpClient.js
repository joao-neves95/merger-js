/*
 * Copyright (c) 2018-2019 João Pedro Martins Neves - All Rights Reserved.
 *
 * MergerJS (merger-js) is licensed under the MIT license, located in
 * the root of this project, under the name "LICENSE.md".
 *
 */

'use strict';
const https = require( 'https' );
const { IncomingMessage } = require( 'http' );

/**
 * Allways HTTPS.
 */
module.exports = {
  /**
   * Get HTTPS async.
   * It returns a Response object with the data in Response.body.
   * 
   * @param { string } url
   * @param { boolean } parseJson Defaults to true. Whether to parse the JSON before return.
   * @param { Function } Callback Optional callback that receives (error, data).
   * 
   * @returns { Promise<IncomingMessage | Error> }
   */
  getAsync: ( url, Callback ) => {
    return new Promise( ( resolve, reject ) => {

      try {
        https.get( url, { headers: { "User-Agent": `MergerJS/${global.version}` } }, ( res ) => {
          res.setEncoding( 'utf8' );
          res.body = '';

          res.on( 'data', ( resData ) => {
            res.body += resData;
          } );

          res.on( 'error', ( err ) => {
            if ( Callback )
              return Callback( err, null );

            reject( err );
          } );

          res.on( 'end', () => {
            if ( Callback )
              return Callback( null, res );

            resolve( res );
          } );
        } );

      } catch ( e ) {
        if ( Callback )
          return Callback( e, null );

        reject( e );
      }

    } );
  }
};
