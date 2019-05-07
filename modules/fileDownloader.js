/*
 * Copyright (c) 2018-2019 João Pedro Martins Neves - All Rights Reserved.
 *
 * MergerJS (merger-js) is licensed under the MIT license, located in
 * the root of this project, under the name "LICENSE.md".
 *
 */

'use strict';
const path_join = require( 'path' ).join;
const httpClient = require( './httpClient' );
const Utils = require( './utils' );
const style = require( './consoleStyling' );
const HOST_RAW_GITHUB = 'https://raw.githubusercontent.com/';
const GITHUB_API_BASE_URL = 'https://api.github.com/';
const NODE_MODULES_PATH = global.config.nodeModulesPath;

class FileDownloader {
  /**
   * Downloads a file from an URL and saves it to node_modules.
   * 
   * @returns { Promise<string | Error> }
   */
  static fromUrl( url, Callback ) {
    return new Promise( async ( resolve, reject ) => {

        try {
          const fileName = Utils.getFileNameFromUrl( url );
          const fileContent = await httpClient.getAsync( url, false );
          await Utils.saveFileInNodeModules( fileName, fileContent );

          if ( Callback )
            return Callback( fileName );

          resolve( fileName );

        } catch ( err ) {
          if ( Callback )
            return Callback( err, null );

          reject( err );
        }

    } );
  }


  /**
   * [DEPRECATED, used for the previous sintax]
   * Downloads a file from GitHub and saves it to node_modules. Returns the file name or an error.
   * 
   * @param { string } path <userName>/<repositoryName>/(<branchName>)/<pathToFile>
   * @param { function } Callback (<string | Error>)
   * 
   * @returns { Promise<string | Error> }
   * @deprecated
   */
  static fromGitHub_deprecated( path, Callback ) {
    return new Promise( async ( resolve, reject ) => {

      if ( path.startsWith( '/' ) )
        path = path.substring( 1 );

      let url = HOST_RAW_GITHUB + path;
      const fileName = Utils.getFileNameFromUrl( url );
      let fileContent = null;

      try {
          fileContent = await httpClient.getAsync( url, false );

          if ( fileContent === '404: Not Found\n' ) {
            let urlArr = new URL( url ).pathname.split( '/' );
            urlArr.splice( 3, 0, 'master' );
            url = HOST_RAW_GITHUB + urlArr.join( '/' );

            try {
              fileContent = await httpClient.getAsync( url, false );

              if ( fileContent === '404: Not Found\n' )
                console.error( style.styledError, `There was an error while downloading file from GitHub ("${new URL( url ).pathname}"):\n` );

            } catch ( e ) {
              console.error( style.styledError, `There was an error while downloading file from GitHub ("${new URL( url ).pathname}"):\n` );
            }
          }

        } catch ( e ) {
          console.error( style.styledError, `There was an error while downloading file from GitHub ("${path}"):\n` );
        }

        try {
          await Utils.saveFileInNodeModules( fileName, fileContent );

          if ( Callback )
            return Callback( fileName );

          resolve( fileName );

        } catch ( e ) {
          console.error( style.styledError, `There was an error while saving the file from GitHub ("${path}") on node_modules:\n` );

          if ( Callback )
            return Callback( e );

          return reject( e );
        }

    } );
  }

  // https://api.github.com/repos/{user}/{repoName}/contents{pathToFile}?ref={branch}
  /**
   * Downloads a file or directory of files from github and save it/them to node_modules.
   * 
   * @param { string[] } buildOrder
   * @param { string } user
   * @param { string } repo
   * @param { string } pathToFile
   * @param { string } branch
   * 
   * @returns { string[] }
   */
  static async fromGithub( user, repo, pathToFile, branch = 'master' ) {
    let allFilePaths = [];
    let i;

    try {
      const thisRepoDirName = Utils.buildGithubRepoDirName( user, repo );
      const jsonApiResponse = await FileDownloader.getJsonFromGithubApi( user, repo, pathToFile, branch );
      await Utils.mkdir( path_join( global.config.nodeModulesPath, thisRepoDirName ) );

      let currentFileContent = '';
      let currentFilePath = '';

      for ( i = 0; i < jsonApiResponse.length; ++i ) {
        if ( Utils.fileExt( jsonApiResponse[i].name ) !== '.js' )
          continue;

        currentFilePath = path_join( NODE_MODULES_PATH, thisRepoDirName, jsonApiResponse[i].path );
        allFilePaths.push( currentFilePath );
        currentFileContent = await httpClient.getAsync( jsonApiResponse[i].download_url );
        await Utils.saveFileInNodeModules( currentFilePath, currentFileContent );
      }

      return allFilePaths;

    } catch ( e ) {
      console.error(
        style.styledError,
        `There was an error while downloading a file from GitHUb: "${user}/${repo}/${pathToFile}".\nCheck the path name.\n\n`, e );
      process.exit( 1 );
      process.kill( process.pid, 'SIGINT' );
      setTimeout( () => {
        process.kill( process.pid, 'SIGKILL' );
      }, 5000 );
    }
  }

  static async getJsonFromGithubApi( user, repo, pathToFile, branch = 'master' ) {
    return await httpClient.getAsync( FileDownloader.buildGithubAPIUrl( user, repo, pathToFile, branch ) );
  }

  static buildGithubAPIUrl( user, repo, pathToFile, branch = 'master' ) {
    return `${GITHUB_API_BASE_URL}repos/${user}/${repo}/contents/${pathToFile}?ref=${master}`;
  }
}

module.exports = FileDownloader;
