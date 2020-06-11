/*
 * Copyright (c) 2018-2020 João Pedro Martins Neves - All Rights Reserved.
 *
 * MergerJS (merger-js) is licensed under the
 * GPLv3.0 license (GNU General Public License v3.0),
 * located in the root of this project, under the name "LICENSE.md".
 */

'use strict';
const fs = require('fs');
const path = require( 'path' );
const StaticClass = require( '../../models/staticClassBase' );
const SourceFileModel = require( '../../models/sourceFileModel' );
const parseFile = require('./parseFile');
const minifyCode = require( './minifyCode' );
const { removeBOM } = require( '../utils' );
const notify = require('../notifications').notif;
const style = require('../consoleStyling');
const newTimestamp = require( '../newTimestamp' ).small;

const BUILD_ON_CHANGES_MESSAGE = 'Ready to build. Listening for file changes...';

class Compiler extends StaticClass {

  constructor() {
    super( Compiler.name );
  }

  /**
   * @static
   * @param { SourceFileModel } sourceFile
   * @param { string[] | null } buildOrder
   * @returns { Promise<void | Error> }
   * @memberof Compiler
   */
  static async run( sourceFile, buildOrder = null ) {
    return new Promise( async ( resolve, reject ) => {
      console.time( ' Build Time' );
      console.info( ' Building...' );

      try {
        await Compiler.____compile( sourceFile, !buildOrder ? await parseFile( sourceFile.source ) : buildOrder );

        let timestamp = newTimestamp();
        let notifMessage = timestamp;

        if ( global.config.autoBuild ) {
          notifMessage += `\n${BUILD_ON_CHANGES_MESSAGE}`;
          console.info( `\n ${BUILD_ON_CHANGES_MESSAGE}\n` );
        }

        notify( 'Build Complete.', notifMessage );
        console.info( '\n', timestamp, '-', style.successText( 'Build complete.' ) );
        console.info( ' File Path:', path.join( sourceFile.output.path, sourceFile.output.name ) );
        console.timeEnd( ' Build Time' );

        return resolve();

      } catch ( e ) {
        return reject( e );
      }
    } );
  }

  /**
   * @private
   * @param { SourceFileModel } sourceFile
   * @param { string[] | null } buildOrder
   * @returns { Promise<void | Error> }
   * @memberof Compiler
   */
  static ____compile( sourceFile, buildOrder ) {
    return new Promise( ( resolve, reject ) => {

      let allData = {};

      // Read all the data from each file (with file names):
      for (let i = 0; i < buildOrder.length; ++i) {
        let thisFilePath;

        if ( buildOrder[i].includes( '\\node_modules\\' ) || buildOrder[i].includes( '/node_modules/' ) ) {
          thisFilePath = buildOrder[i];

        } else {
          thisFilePath = path.join( path.dirname( sourceFile.source ), buildOrder[i] );
        }

        try {
          allData[buildOrder[i]] = removeBOM( fs.readFileSync( thisFilePath, 'utf-8' ) ) + '\n';

        } catch (e) {
          console.error( style.styledError, e );
          process.exit( 1 );
        }
      }

      // Minify if necessary:
      const data = minifyCode( allData );
      const buildPath = sourceFile.output.path;
      const buildName = sourceFile.output.name;

      fs.writeFile( path.join( buildPath, buildName ), data, 'utf-8', ( err ) => {
        if ( err ) {
          // If the dir does not exist, make a new dir.
          if ( err.code === 'ENOENT' ) {
            fs.mkdir( buildPath, ( err ) => {
              if ( err ) {
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

        return resolve();
      } );
    } );
  }

}

module.exports = Compiler;
