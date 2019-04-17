/*
 * Copyright (c) 2018-2019 João Pedro Martins Neves - All Rights Reserved.
 *
 * MergerJS (merger-js) is licensed under the MIT license, located in
 * the root of this project, under the name "LICENSE.md".
 *
 */

'use strict';
const https = require( 'https' );

/**
 * Allways HTTPS.
 */
module.exports = {
  /**
   * Get HTTPS async.
   * 
   * @param { string } url
   * @param { boolean } parseJson Defaults to true. Whether to parse the JSON before return.
   * @param { Function } Callback Optional callback that receives (error, data).
   * 
   * @returns { Promise<string | Error> }
   */
  getAsync: ( url, parseJson = true, Callback ) => {
    return new Promise( ( resolve, reject ) => {

      try {
        https.get( url, ( res ) => {
          res.setEncoding( 'utf8' );

          let allData = '';

          res.on( 'data', ( resData ) => {
            allData += resData;
          } );

          res.on( 'error', ( err ) => {
            if ( Callback )
              return Callback( err, null );

            reject( err );
          } );

          res.on( 'end', () => {
            if ( parseJson )
              allData = JSON.parse( allData );

            if ( Callback )
              return Callback( null, allData );

            resolve( allData );

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
