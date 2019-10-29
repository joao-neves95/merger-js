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
const ImportLineParser = require( './importLineParser' );
const addPropertyToConfig = require( '../configFileAccess' ).addProperty;
const ImportType = require( '../../enums/importType' );
const ConfigKeysType = require( '../../enums/configKeysEnum' );
const style = require( '../consoleStyling' );

/**
 * 
 * @param { string } Path The path of the header file.
 * @param { Function } Callback ( buildOrder:string[] ) Receives the build order array of file paths inputed by the user.
 * 
 * @returns { Promise<string[]> }
 */
module.exports = ( Path, Callback ) => {
  return new Promise( async ( _res, _rej ) => {

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
      let thisFile = null;
      /** @type { string } */
      let directotyPath = '';

      const parsedLine = ImportLineParser.parse( line );

      switch ( parsedLine.importType ) {
        case ImportType.NodeModules:
        case ImportType.SpecificURL:
        case ImportType.GitHub:

          try {
            const createdNodeModules = await Utils.createNodeModulesIfNeeded();

            if ( createdNodeModules ) {
              NODE_MODULES_PATH = global.config.nodeModulesPath;
              await addPropertyToConfig( ConfigKeysType.nodeModulesPath, NODE_MODULES_PATH );
            }

          } catch ( e ) {
            return ____nodeModulesCreationError( line );
          }

          break;

        default:
          break;
      }

      switch ( parsedLine.importType ) {

        case ImportType.RelativePath:
          directotyPath = Path;
          break;

        case ImportType.NodeModules:
          directotyPath = NODE_MODULES_PATH;
          break;

        case ImportType.SpecificURL:
          directotyPath = NODE_MODULES_PATH;
          const fileName = Utils.getFileNameFromUrl( parsedLine.path );

          let fileExists = true;
          if ( !parsedLine.forceInstall ) {
            fileExists = await Utils.fileExists( path.join( NODE_MODULES_PATH, fileName ) );
          }

          if ( !fileExists || parsedLine.forceInstall ) {
            try {
              await fileDownloader.fromUrl( parsedLine.path );

            } catch ( e ) {
              console.error( style.styledError, `There was an error while downloading a file from url ("${url}")\n`, e );
            }
          }

          parsedLine.path = fileName;
          break;

        case ImportType.GitHub:
          const splitedPath = parsedLine.path.split( '/' );
          const pathToFile = splitedPath.slice( 2 ).join( '/' );

          /** 
           *  The name of the folder where the file(s) will be stored on node_modules.
           *  @type { string }
           */
          const repoDirName = path.join( Utils.buildGithubRepoDirName( splitedPath[0], splitedPath[1] ) );
          directotyPath = path.join( NODE_MODULES_PATH, repoDirName );

          // #region GITHUB FILES

          if ( !parsedLine.isDir ) {
            const fileName = path.basename( parsedLine.path );
            let alreadyDowloadedDeprecatedSyntax = false;
            let alreadyDowloadedNewSyntax = false;

            if ( !parsedLine.forceInstall && parsedLine.isGithubNewSyntax ) {
              alreadyDowloadedNewSyntax = await Utils.fileExists( path.join( directotyPath, pathToFile ) );

              // We need to check with the deprecated syntax, to avoid breaking changes.
            } else if ( !parsedLine.forceInstall && !parsedLine.isGithubNewSyntax ) {
              alreadyDowloadedDeprecatedSyntax = await Utils.fileExists( path.join( NODE_MODULES_PATH, fileName ) );
            }

            if (
              ( parsedLine.isGithubNewSyntax && !alreadyDowloadedNewSyntax ) ||
              ( parsedLine.forceInstall || parsedLine.isGithubNewSyntax )
            ) {
              await fileDownloader.fromGithub( splitedPath[0], splitedPath[1], pathToFile, parsedLine.branchName );

              // We need to use the deprecated method to avoid breaking changes.
            } else if (
              ( !parsedLine.isGithubNewSyntax && !alreadyDowloadedDeprecatedSyntax ) ||
              ( parsedLine.forceInstall && !parsedLine.isGithubNewSyntax )
            ) {
              await fileDownloader.fromGitHub_deprecated( parsedLine.path );
            }

            if ( parsedLine.isGithubNewSyntax ) {
              parsedLine.path = pathToFile;

            } else {
              directotyPath = NODE_MODULES_PATH;
              parsedLine.path = fileName;
            }

            // #endregion GITHUB FILES

            // #region GITHUB DIRECTORIES

            // For directories it is used exclusively the new syntax.
          } else {
            let alreadyDownloaded = false;

            if ( !parsedLine.forceInstall ) {
              alreadyDownloaded = await Utils.dirExists( path.join( directotyPath, pathToFile ) );
            }

            if ( !alreadyDownloaded || parsedLine.forceInstall ) {
              const allFiles = await fileDownloader.fromGithub( splitedPath[0], splitedPath[1], pathToFile, parsedLine.branchName );
              buildOrder = buildOrder.concat( allFiles );

              // This is to block adding any files to build order,
              // bellow this switch.
              parsedLine.isDir = false;
              thisFile = '';

            } else {
              const allFilesFromRepoDir = await Utils.readDir( path.join( directotyPath, pathToFile ) );

              for ( let i = 0; i < allFilesFromRepoDir.length; ++i ) {
                if ( path.extname( allFilesFromRepoDir[i] ) !== '.js' ) {
                  continue;
                }

                buildOrder.push( path.join( directotyPath, pathToFile, allFilesFromRepoDir[i] ) );
              }

              // This is to block adding any files to build order,
              // bellow this switch.
              parsedLine.isDir = false;
              thisFile = '';
            }

            // #endregion GITHUB DIRECTORIES

          }
          break;

        default:
          parsedLine.path = null;
          break;
      }

      if ( parsedLine.isDir ) {
        await ____addAllDirectoryToBuildOrder( buildOrder, directotyPath, parsedLine.path );

      } else if ( thisFile === null && parsedLine.path !== null ) {

        if ( parsedLine.importType === ImportType.RelativePath ) {
          directotyPath = '';
        }

        thisFile = path.join( directotyPath, parsedLine.path );

        try {
          if ( path.extname( thisFile ) !== '.js' ) {
            thisFile += '.js';
          }

          if ( !buildOrder.includes( thisFile ) ) {
            buildOrder.push( path.normalize( thisFile ) );
          }

        } catch ( e ) {
          // Invalid import statement.
        }
      }

      ++line;
      rl.resume();

      if ( lineNum >= 20 && !lastLineWasComment ) {
        rl.close();
      }

    } );

    rl.on( 'end', () => {
      if ( Callback ) {
        return Callback( buildOrder );
      }

      return _res( buildOrder );
    } );

  } );
};

// #region HELPER FUNCTIONS

/**
 * 
 * @param { string[] } buildOrder An array that contains all the build paths.
 * @param { string } thePath The path of the header file directory.
 * @param { string } treatedLine The path inputed by the user.
 * 
 * @return { boolean } Returns false in cae it's not a directory.
 * In case of exception, it kill the process and logs the error message.
 */
const ____addAllDirectoryToBuildOrder = async ( buildOrder, thePath, treatedLine ) => {
  // treatedLine now holds the directory inputed by the user.
  const thisDir = path.join( path.dirname( thePath ), treatedLine );

  try {
    const files = await Utils.readDir( thisDir );

    for ( let i = 0; i < files.length; ++i ) {
      if ( path.extname( files[i] ) === '.js' ) {
        buildOrder.push( path.join( treatedLine, files[i] ) );
      }
    }

  } catch ( e ) {
    console.error(
      style.styledError,
      `There was an error while reading the file names from the directory: "${thisDir}". Probably it does not exist.\n\n`,
      e
    );

    return killProcess();
  }

  return true;
};

/**
 * Prinsts the node_modules file creation error.
 * @param { string } fileName The file name where the error occured.
 * 
 * @returns { void } Logs the error to the console.
 */
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
    return false;
  }, 5000 );

  return false;
};

// #endregion HELPER FUNCTIONS
