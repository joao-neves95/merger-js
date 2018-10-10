﻿'use strict';
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
          try {
            if ( parseJson )
              allData = JSON.parse( allData );

            if ( Callback )
              return Callback( null, allData );

            resolve( allData );

          } catch ( err ) {
            if ( Callback )
              return Callback( err, null );

            reject( err );
          }
        } );

      } );

    } );
  }
};