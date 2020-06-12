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
const chokidar = require('chokidar');
const StaticClass = require( '../../models/staticClassBase' );
const SourceFileModel = require( '../../models/sourceFileModel' );
const FileParserParams = require( '../../models/fileParserParams' );
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
  static async run( sourceFile ) {
    return new Promise( async ( resolve, reject ) => {
      try {
        const fileParserParams = new FileParserParams( sourceFile.source, true, true );
        const buildOrder = await parseFile( fileParserParams );

        // Execute one time builds:
        if ( !global.config.autoBuild ) {
          await Compiler.____compile( sourceFile, buildOrder );
          return resolve();
        }

        // Execute an auto build session (with file watcher):
        const watcher = chokidar.watch( buildOrder, { persistent: true, cwd: path.dirname( sourceFile.source ) } );

        watcher
          .on( 'ready', async () => {
            console.info( ' Initial scan complete. Ready to build on changes...' );
            await Compiler.____compile( sourceFile, buildOrder );

          } )
          .on( 'error', err => console.error( 'Auto build error: ', err ) )
          .on( 'change', async ( path, stats ) => {
            await Compiler.____compile( sourceFile, await parseFile( fileParserParams ) );

          } );

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
      console.time( ' Build Time' );
      console.info( ' Building...' );

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
          if ( err.code !== 'ENOENT' ) {
            console.error( style.ERROR, err );
            return reject( err );
          }

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

        }
      } );

      const timestamp = newTimestamp();
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
    } );
  }

}

module.exports = Compiler;
