'use strict';
const fs = require('fs');
const path = require('path');
const readline = require( 'readline' );
const cleanImportFileInput = require( './utils' ).cleanImportFileInput;
const style = require( './consoleStyling' );

module.exports = ( Path, Callback ) => {
  let lineNum = 0;
  let buildOrder = [];
  buildOrder.push( path.basename( Path ) );

  const rl = readline.createInterface( {
    input: fs.createReadStream( Path )
  } );

  rl.on( 'line', ( line ) => {
    let treatedLine = line.replace( /\s/g, '' );
    let file;

    if ( treatedLine.startsWith( '@import', 2 ) || treatedLine.startsWith( '@', 2 ) ) {
      file = cleanImportFileInput( treatedLine );
      ++lineNum;

    } else if ( treatedLine.startsWith( '$import', 2 || treatedLine.startsWith( '$', 2 ) ) ) {
      file = cleanImportFileInput( treatedLine );

      if ( global.config.nodeModulesPath === undefined ) {
        return console.error(
          style.styledError,
          style.errorText( `Could not merge "${file}" file, "node_modules" directory not found.` ),
          '\n Please run "npm init", if you didn\'t, and install a package with "npm install <package name>".\n'
        );
      }

      file = path.join( global.config.nodeModulesPath, file );
      ++lineNum;

    } else if ( lineNum >= 20 && !treatedLine.startsWith( '//' ) ) {
      rl.close();
    }

    if ( path.extname( file ) !== '.js' )
      file += '.js';

    if ( !buildOrder.includes( file ) )
      buildOrder.push( file );

  } );

  rl.on( 'close', () => {
    Callback( buildOrder );
  } );
};
