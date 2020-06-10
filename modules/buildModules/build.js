﻿/*
 * Copyright (c) 2018-2020 João Pedro Martins Neves - All Rights Reserved.
 *
 * MergerJS (merger-js) is licensed under the
 * GPLv3.0 license (GNU General Public License v3.0),
 * located in the root of this project, under the name "LICENSE.md".
 */

'use strict';
const fs = require('fs');
const path = require( 'path' );
const async = require( 'neo-async' );
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
  static async Run( sourceFile, buildOrder = null ) {
    return new Promise( async ( resolve, reject ) => {
      console.time( ' Build Time' );
      console.info( ' Building...' );

      try {
        await Compiler.#Compile( sourceFile, !buildOrder ? await parseFile( sourceFile.source ) : buildOrder );

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
  static #Compile( sourceFile, buildOrder ) {
    return new Promise( ( resolve, reject ) => {

      let allData = {};

      // Read all the data from each file (with file names):
      async.eachSeries( buildOrder, ( file, Callback ) => {
        let thisFilePath;

        if ( file.includes( '\\node_modules\\' ) || file.includes( '/node_modules/' ) ) {
          thisFilePath = file;

        } else {
          thisFilePath = path.join( path.dirname( sourceFile.source ), file );
        }

        fs.readFile( thisFilePath, 'utf-8', ( err, data ) => {
          if ( err ) return Callback( err );

          allData[file] = removeBOM( data ) + '\n';
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
      } );

    } );
  }

}

module.exports = Compiler;
