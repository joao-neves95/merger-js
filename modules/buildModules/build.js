'use strict';
const fs = require('fs');
const path = require( 'path' );
const async = require( 'neo-async' );
const parseImports = require('./parseImports');
const minifyCode = require('./minifyCode');
const notify = require('../notifications').notif;
const style = require('../consoleStyling');
const newTimestamp = require('../newTimestamp').small;
const buildOnChanges = 'Ready to build. Listening for file changes...';

const build = ( sourceFile, buildOrder ) => {
  return new Promise( ( resolve, reject ) => {

    let allData = {};

    // Read all the data from each file (with file names):
    async.eachSeries( buildOrder, ( file, Callback ) => {
      let thisFilePath;

      if ( file.includes( '\\node_modules\\' ) || file.includes( '/node_modules/' ) )
        thisFilePath = file;
      else
        thisFilePath = path.join( path.dirname( sourceFile.source ), file );

      fs.readFile( thisFilePath, 'utf-8', ( err, data ) => {
        if ( err ) return Callback( err );

        allData[file] = data;
        Callback();
      } );
    }, ( err ) => {
      if ( err ) {
        console.error( style.styledError, err );
        return reject( err );
      }

      // Minify if necessary:
      minifyCode( allData, ( data ) => {
        const buildPath = sourceFile.output.path;
        const buildName = sourceFile.output.name;

        fs.writeFile( path.join( buildPath, buildName ), data, 'utf-8', ( err ) => {
          if ( err ) {
            // If the dir does not exist, make a new dir.
            if ( err.code === 'ENOENT' ) {
              fs.mkdir( buildPath, ( err ) => {
                if ( err ) if ( err ) {
                  console.error( style.ERROR, err );
                  return reject( err );
                }

                fs.writeFile( path.join( buildPath, buildName ), data, 'utf-8', ( err ) => {
                  if ( err ) {
                    console.error( style.ERROR, err );
                    return reject( err );
                  }

                } );
              } );

            } else {
              console.error( style.ERROR, err );
              return reject( err );
            }
          }

          let timestamp = newTimestamp();
          let notifMessage = timestamp;

          if ( global.config.autoBuild ) {
            notifMessage += `\n${buildOnChanges}`;
            console.info( `\n ${buildOnChanges}\n` );
          }

          notify( 'Build Complete.', notifMessage );
          console.info( '\n', timestamp, '-', style.successText( 'Build complete.' ) );
          console.info( ' File Path:', buildPath + buildName );
          console.timeEnd( ' Build Time' );
          return resolve();
        } );
      } );
    } );

  } );
};

module.exports = ( sourceFile, buildOrder ) => {
  return new Promise( async ( resolve, reject ) => {
    console.time( ' Build Time' );
    console.info( ' Building...' );

    if ( !buildOrder ) {
      parseImports( sourceFile.source, async ( redefinedBuldOrder ) => {
        try {
          await build( sourceFile, redefinedBuldOrder );
          return resolve();

        } catch ( e ) {
          return reject( e );
        }
      } );

    } else {
      try {
        await build( sourceFile, buildOrder );
        return resolve();

      } catch ( e ) {
        return reject( e );
      }
    }
  } );
};
