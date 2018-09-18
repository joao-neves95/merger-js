'use strict'
const fs = require('fs');
const path = require('path');
const whilst = require('../node_modules/neo-async').whilst;
const each = require('../node_modules/neo-async').each;
const style = require('./consoleStyling');

/**
 * Searches for and returns the path of the requested file or directory.
 * NOTE: It returns void if the file/directory isn't found or a console error in case the input is "merger-config.json".
 * 
 * @param { string } fileOrDir The name of the file or directory to find.
 * @param { Function } Callback A callback that receives the complete file/directory path.
 * 
 * @returns { string | void }
 */
module.exports = ( fileOrDir, Callback ) => {
  let currentDir = process.cwd();
  let foundFile = false;
  let lastDir;

  whilst( () => {
    let isToContinue;

    !currentDir ? isToContinue = false :
      ( lastDir === currentDir ) ? isToContinue = false :
        foundFile ? isToContinue = false :
          isToContinue = true;

    return isToContinue;
  },
    ( whilstAgain ) => {
      fs.readdir( currentDir, 'utf-8', ( err, files ) => {
        if ( err )
          return console.error( style.styledError, err );

        each( files, ( file, eachAgain ) => {

          if ( file === fileOrDir ) {
            foundFile = true;
            return Callback( path.join( currentDir, file ) );
          } else {
            eachAgain();
          }

        }, ( err ) => {
          if ( err )
            return console.error( style.styledError, err );

          lastDir = currentDir;
          currentDir = path.join( currentDir, '../' );
          whilstAgain( null, null );
        } );
      } );
    },
    ( err, n ) => {
      if ( err )
        return console.error( style.styledError, err );

      if ( fileOrDir === 'merger-config.json' )
        return console.error( style.styledError, ' merger-config file not found. Please run "merger init".' );

      return;
    }
  );
};
