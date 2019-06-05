/*
 * Copyright (c) 2018-2019 João Pedro Martins Neves - All Rights Reserved.
 *
 * MergerJS (merger-js) is licensed under the MIT license, located in
 * the root of this project, under the name "LICENSE.md".
 *
 */

'use strict';
const path = require('path');
const lineByLine = require( 'line-by-line' );
const fileDownloader = require( '../fileDownloader' );
const Utils = require( '../utils' );
const addPropertyToConfig = require( '../CLIModules/editConfigFile' ).addProperty;
const style = require( '../consoleStyling' );
const ConfigKeysType = require( '../../models/configKeysEnum' );

/**
 * 
 * @param { string } Path The path of the header file.
 * @param { Function } Callback ( buildOrder:string[] ) Receives the build order array of file paths inputed by the user.
 */
module.exports = ( Path, Callback ) => {
  let NODE_MODULES_PATH = global.config.nodeModulesPath;
  let lineNum = 0;
  let lastLineWasComment = false;
  let buildOrder = [];
  buildOrder.push( path.basename( Path ) );

  const rl = new lineByLine( Path, {
    encoding: 'utf8',
    skipEmptyLines: true
  } );

  rl.on( 'line', async ( line ) => {
    rl.pause();
    let thisFile;
    let treatedLine = line.replace( /\s/g, '' );

    lastLineWasComment = treatedLine.trimStart().startsWith( '//' );

    // #region IMPORT FROM RELATIVE PATH OR DIRECTORY

    if ( treatedLine.startsWith( '@import', 2 ) || treatedLine.startsWith( '@', 2 ) ) {
      treatedLine = Utils.removeImportFromInput( treatedLine );

      // FROM A DIRECTORY.
      const wasDir = await ____addAllDirectoryToBuildOrder( buildOrder, Path, treatedLine );
      if ( wasDir )
        thisFile = null;
      else
        // FROM A RELATIVE FILE PATH.
        thisFile = Utils.cleanImportFileInput( treatedLine );

      ++lineNum;

    // #endregion

    // #region IMPORT FROM node_modules

    } else if ( treatedLine.startsWith( '$import', 2 ) || treatedLine.startsWith( '$', 2 ) ) {
      treatedLine = Utils.removeImportFromInput( treatedLine );

      try {
        const createdNodeModules = await Utils.createNodeModulesIfNeeded();
        if ( createdNodeModules ) {
          NODE_MODULES_PATH = global.config.nodeModulesPath;
          await addPropertyToConfig( ConfigKeysType.nodeModulesPath, NODE_MODULES_PATH );
        }

        // AN ENTIRE DIRECTORY.
        const wasDir = await ____addAllDirectoryToBuildOrder( buildOrder, NODE_MODULES_PATH, treatedLine );
        if ( wasDir )
          thisFile = null;
        else {
          // A FILE.
          thisFile = Utils.cleanImportFileInput( treatedLine );
          thisFile = path.join( NODE_MODULES_PATH, thisFile );
        }

      } catch ( e ) {
        return ____nodeModulesCreationError( thisFile );
      }

      ++lineNum;

    // #endregion

    // #region IMPORT FROM AN URL

    } else if ( treatedLine.startsWith( '%import', 2 ) || treatedLine.startsWith( '%', 2 ) || treatedLine.startsWith( '%%', 2 ) ) {
      const forceInstall = treatedLine.startsWith( '%%', 2 );
      treatedLine = Utils.removeImportFromInput( treatedLine );

      try {
        const createdNodeModules = await Utils.createNodeModulesIfNeeded();
        if ( createdNodeModules ) {
          NODE_MODULES_PATH = global.config.nodeModulesPath;
          await addPropertyToConfig( ConfigKeysType.nodeModulesPath, NODE_MODULES_PATH );
        }

      } catch ( e ) {
        return ____nodeModulesCreationError( line );
      }

      //#region FROM GITHUB
      // // %import<<GH::{branch} '{user}/{repo}/{pathToFile}.js'
      // // %import<<GH::{branch}<<DIR '{user}/{repo}/{pathToFile}.js'
      // // %import<<GH::master<<DIR '{user}/{repo}/{pathToFile}.js'
      // DEPRECATED syntax: // %import<<GH '{user}/{repo}/{branch}/{pathToFile}.js'
      if ( treatedLine.startsWith( '<<gh' ) ||
           treatedLine.startsWith( '<<GH' ) ||
           treatedLine.startsWith( '<<github' ) ||
           treatedLine.startsWith( '<<GITHUB' ) )
      {
        treatedLine = Utils.removeGithubTokenFromImport( treatedLine );
        let isNewSyntax = false;
        let branch = '';
        if ( treatedLine.startsWith( '::' ) ) {
          treatedLine = treatedLine.replace( /::/g, '' );

          for ( let i = 0; i < treatedLine.length; ++i ) {
            if ( treatedLine[i] === '<' || treatedLine[i] === "'" || treatedLine[i] === ' ' )
              break;

            branch += treatedLine[i];
          }

          isNewSyntax = true;
          treatedLine = treatedLine.substring( branch.length );
        }

        const isDir = ____pathIsDir( treatedLine );
        treatedLine = Utils.removeDirTokenFromImport( treatedLine );

        if ( treatedLine.startsWith( '::' ) )
          console.error( style.styledError, `Unexpected token "::" on the line: "${line}" \n` );

        // "treatedLine" now contains only the GitHub path imputed by the user.
        treatedLine = Utils.cleanImportFileInput( treatedLine );
        /** The path inputed by the user. 
         * @type { string[] } */
        const githubPath = treatedLine.split( '/' );
        /** The inputed GitHub path to the file or directory, without the user 
         *  and repository name, inputed by the user. */
        const inputedPathToFile = githubPath.slice( 2 ).join( '/' );
        /** The name of this repository on node_modules. */
        const thisRepoDirName = Utils.buildGithubRepoDirName( githubPath[0], githubPath[1] );
        /** The directory path from node_modules, including. */
        const thisRepoDirPath = path.join( NODE_MODULES_PATH, thisRepoDirName );

        //#region FROM A GITHUB DIRECTORY.
        // (using exclusively the new syntax)
        if ( isDir ) {
          const thisRepoDirDirPath = path.join( thisRepoDirPath, inputedPathToFile );
          let alreadyDownloaded = false;

          if ( !forceInstall )
            alreadyDownloaded = await Utils.dirExists( thisRepoDirDirPath );

          if ( !alreadyDownloaded || forceInstall ) {
            const allFiles = await fileDownloader.fromGithub(
              githubPath[0],
              githubPath[1],
              inputedPathToFile,
              branch === '' ? 'master' : branch
            );

            buildOrder = buildOrder.concat( allFiles );

          } else {
            const allFilesFromRepoDir = await Utils.readDir( thisRepoDirDirPath );

            for ( let i = 0; i < allFilesFromRepoDir.length; ++i ) {
              if ( path.extname( allFilesFromRepoDir[i] ) !== '.js' )
                continue;

              buildOrder.push( path.join( thisRepoDirDirPath, allFilesFromRepoDir[i] ) );
            }
          }

          thisFile = null;
        //#endregion

        //#region FROM A GIRHUB FILE.
        // (using the new syntax, but supporting the deprecated syntax)
        // TODO: Remove support for the deprecated syntax on v4, if there is one.
        } else {
          const fileName = path.basename( treatedLine );
          let alreadyDownloadedPreviousSyntax = false;
          let alreadyDownloadedNewSyntax = false;

          if ( !forceInstall && !isNewSyntax ) {
            // No need to check with the previous syntax.
            alreadyDownloadedPreviousSyntax = await Utils.fileExists( path.join( NODE_MODULES_PATH, fileName ) );

          } else if ( !forceInstall && isNewSyntax ) {
            alreadyDownloadedNewSyntax = await Utils.fileExists( path.join( thisRepoDirPath, inputedPathToFile ) );
          }

          if ( ( isNewSyntax && !alreadyDownloadedNewSyntax ) || ( isNewSyntax && forceInstall ) ) {
            await fileDownloader.fromGithub( githubPath[0], githubPath[1], inputedPathToFile, branch === '' ? 'master' : branch );

          } else if ( ( !isNewSyntax && !alreadyDownloadedPreviousSyntax ) || ( !isNewSyntax && forceInstall ) ) {
            // use the deprecated method. 
            await fileDownloader.fromGitHub_deprecated( treatedLine, branch );
          }

          thisFile = isNewSyntax ? path.join( thisRepoDirPath, inputedPathToFile ) :
            path.join( NODE_MODULES_PATH, fileName );
        }
        //#endregion

      //#endregion

      //#region FROM A SPECIFIC URL
      } else {
        let url = Utils.cleanImportFileInput( treatedLine );
        const fileName = Utils.getFileNameFromUrl( url );
        let fileExists = true;
        if ( !forceInstall )
          fileExists = await Utils.fileExists( path.join( NODE_MODULES_PATH, fileName ) );

        if ( !fileExists || forceInstall ) {
          try {
            await fileDownloader.fromUrl( url );

          } catch ( e ) {
            console.error( style.styledError, `There was an error while downloading a file from url ("${url}")\n`, e );
          }
        }

        thisFile = path.join( NODE_MODULES_PATH, fileName );
      }

      ++lineNum;
      //#endregion

      // #endregion
    }

    try {
      if ( path.extname( thisFile ) !== '.js' )
        thisFile += '.js';

      if ( !buildOrder.includes( thisFile ) && thisFile !== undefined && thisFile !== null )
        buildOrder.push( path.normalize( thisFile ) );

    } catch ( e ) {
      // Invalid import statement.
    }

    rl.resume();

    if ( lineNum >= 20 && !lastLineWasComment )
      rl.close();

  } );

  rl.on( 'end', () => {
    return Callback( buildOrder );
  } );
};

const ____pathIsDir = ( treatedLine ) => {
  return treatedLine.startsWith( '<<dir' ) ||
         treatedLine.startsWith( '<<DIR' ) ||
         treatedLine.startsWith( '<<directory' ) ||
         treatedLine.startsWith( '<<DIRECTORY' );
};

const ____addAllDirectoryToBuildOrder = async ( buildOrder, thePath, treatedLine ) => {
  if ( !____pathIsDir( treatedLine ) )
    return false;

  treatedLine = Utils.removeDirTokenFromImport( treatedLine );
  treatedLine = Utils.cleanImportFileInput( treatedLine );
  // treatedLine now holds the directory inputed by the user.
  const thisDir = path.join( path.dirname( thePath ), treatedLine );

  try {
    const files = await Utils.readDir( thisDir );

    for ( let i = 0; i < files.length; ++i ) {
      if ( path.extname( files[i] ) === '.js' )
        buildOrder.push( path.join( treatedLine, files[i] ) );
    }

  } catch ( e ) {
    console.error( style.styledError, `There was an error while reading the file names from the directory: "${thisDir}". Probably it does not exist.\n\n`, e );
    killProcess();
  }

  return true;
};

const ____nodeModulesCreationError = ( fileName ) => {
  return console.error(
    style.styledError,
    style.errorText( `There has been an error while creating the node_modules file.\n Could not merge "${fileName}", "node_modules" directory not found.` ),
    '\n Please run "npm init", if you didn\'t, and install a package with "npm install <package name>".\n'
  );
};

const killProcess = () => {
  process.exit( 1 );
  process.kill( process.pid, 'SIGINT' );
  setTimeout( () => {
    process.kill( process.pid, 'SIGKILL' );
  }, 5000 );
};
