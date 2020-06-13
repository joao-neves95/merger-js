/*
 * Copyright (c) 2018-2020 João Pedro Martins Neves - All Rights Reserved.
 *
 * MergerJS (merger-js) is licensed under the
 * GPLv3.0 license (GNU General Public License v3.0),
 * located in the root of this project, under the name "LICENSE.md".
 */

'use strict'
const path = require('path');
const isTextPath = require( 'is-text-path' );
const ParsedLine = require( '../../models/parsedLineModel' );
const ImportType = require( '../../enums/importType' );
const ConfigKeysType = require( '../../enums/configKeysEnum' );
const Utils = require( '../utils' );
const fileDownloader = require( '../fileDownloader' );
const addPropertyToConfig = require( '../configFileAccess' ).addProperty;
const style = require( '../consoleStyling' );

/**
 * @param { ParsedLine } parsedLine
 * @param { string[] } buildOrder
 */
module.exports = async (parsedLine, buildOrder) => {
  let NODE_MODULES_PATH = global.config.nodeModulesPath;
  let thisFile = null;
  /** @type { string } */
  let directoryPath = '';

  switch ( parsedLine.importType ) {
    case ImportType.NodeModules:
    case ImportType.SpecificURL:
    case ImportType.GitHub:

      try {
        const createdNodeModules = await Utils.createNodeModulesIfNeeded();

        if ( createdNodeModules ) {
          NODE_MODULES_PATH = global.config.nodeModulesPath;
          addPropertyToConfig( ConfigKeysType.nodeModulesPath, NODE_MODULES_PATH );
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
      directoryPath = parsedLine.headerFilePath;
      break;

    case ImportType.NodeModules:
      directoryPath = NODE_MODULES_PATH;
      break;

    case ImportType.SpecificURL:
      directoryPath = NODE_MODULES_PATH;
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
      directoryPath = path.join( NODE_MODULES_PATH, repoDirName );

      // #region GITHUB FILES

      if ( !parsedLine.isDir ) {
        const fileName = path.basename( parsedLine.path );
        let alreadyDowloadedDeprecatedSyntax = false;
        let alreadyDowloadedNewSyntax = false;

        if ( !parsedLine.forceInstall && parsedLine.isGithubNewSyntax ) {
          alreadyDowloadedNewSyntax = await Utils.fileExists( path.join( directoryPath, pathToFile ) );

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
          directoryPath = NODE_MODULES_PATH;
          parsedLine.path = fileName;
        }

        // #endregion GITHUB FILES

        // #region GITHUB DIRECTORIES

        // For directories it is used exclusively the new syntax.
      } else {
        let alreadyDownloaded = false;

        if ( !parsedLine.forceInstall ) {
          alreadyDownloaded = await Utils.dirExists( path.join( directoryPath, pathToFile ) );
        }

        if ( !alreadyDownloaded || parsedLine.forceInstall ) {
          const allFiles = await fileDownloader.fromGithub( splitedPath[0], splitedPath[1], pathToFile, parsedLine.branchName );
          buildOrder = buildOrder.concat( allFiles );

          // This is to block adding any files to build order,
          // bellow this switch.
          parsedLine.isDir = false;
          thisFile = '';

        } else {
          const allFilesFromRepoDir = await Utils.readDir( path.join( directoryPath, pathToFile ) );

          for ( let i = 0; i < allFilesFromRepoDir.length; ++i ) {
            if ( path.extname( allFilesFromRepoDir[i] ) !== '.js' ) {
              continue;
            }

            buildOrder.push( path.join( directoryPath, pathToFile, allFilesFromRepoDir[i] ) );
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
    buildOrder = ____addAllDirectoryToBuildOrder( buildOrder, directoryPath, parsedLine.path );

  } else if ( thisFile === null && parsedLine.path !== null ) {

    if ( parsedLine.importType === ImportType.RelativePath ) {
      directoryPath = '';
    }

    thisFile = path.join( directoryPath, parsedLine.path );

    try {
      if ( !isTextPath( thisFile ) ) {
        thisFile += '.js';
      }

      if ( !buildOrder.includes( thisFile ) ) {
        buildOrder.push( path.normalize( thisFile ) );
      }

    } catch ( e ) {
      // Invalid import statement.
    }
  }

  return buildOrder;
}

/**
 *
 * @param { string[] } buildOrder An array that contains all the build paths.
 * @param { string } thePath The path of the header file directory.
 * @param { string } treatedLine The path inputed by the user.
 *
 * @return { string[] } Returns the build order.
 * In case of exception, it kills the process and logs the error message.
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

    return process.exit( 1 );
  }

  return buildOrder;
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
