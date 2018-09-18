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

    if ( treatedLine.startsWith( '@import', 2 ) || treatedLine.startsWith( '@', 2 ) ) {
      let file = cleanImportFileInput( treatedLine );
      ++lineNum;

      if ( path.extname( file ) !== '.js' )
        file += '.js';
      if ( !buildOrder.includes( file ) )
        buildOrder.push( file );

    } else if ( treatedLine.startsWith( '$import', 2 || treatedLine.startsWith( '$', 2 ) ) ) {
      const npmPackage = cleanImportFileInput( treatedLine );

      if ( global.config.nodeModulesPath === undefined ) {
        return console.error(
          style.styledError,
          style.errorText( `Could not merge "${npmPackage}" package, "node_modules" directory not found.` ),
          '\n Please run "npm init", if you didn\'t, and install a package with "npm install <package name>".\n'
        );
      }

      let file = path.join( global.config.nodeModulesPath, npmPackage );
      ++lineNum;

      if ( path.extname( file ) !== '.js' )
        file += '.js';
      if ( !buildOrder.includes( file ) )
        buildOrder.push( file );

    } else if ( lineNum >= 20 && !treatedLine.startsWith( '//' ) ) {
      rl.close();
    }
  } );

  rl.on( 'close', () => {
    Callback( buildOrder );
  } );
};
