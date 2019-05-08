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
          const fileContentRes = await httpClient.getAsync( url, false );
          await Utils.saveFileInNodeModules( fileName, fileContentRes.body );

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


  // DEPRECATED SINTAX: // %import<<GH '{user}/{repo}/{branch}/{pathToFile}.js'
  // https://raw.githubusercontent.com/{user}/{repo}/{brach}/{pathToFle}.js
  /**
   * [DEPRECATED, used for the previous sintax]
   * Downloads a file from GitHub and saves it to node_modules. Returns the file name or an error.
   * 
   * @param { string } path <userName>/<repositoryName>/(<branchName>)/<pathToFile>
   * @param { string } brach If it's an empty string, the deprecated solution will used.
   * @param { function } Callback (<string | Error>)
   * 
   * @returns { Promise<string | Error> }
   * @deprecated
   */
  static fromGitHub_deprecated( path, branch, Callback ) {
    return new Promise( async ( resolve, reject ) => {

      if ( path.startsWith( '/' ) )
        path = path.substring( 1 );

      if ( branch !== '' ) {
        path = path.split( '/' );
        path.splice( 2, 0, branch );
        path = path.join( '/' );
      }

      let url = HOST_RAW_GITHUB + path;
      const fileName = Utils.getFileNameFromUrl( url );
      let fileContent = null;

      try {
        fileContent = await httpClient.getAsync( url, false );

        if ( fileContent.statusCode === 404 ) {
          path = path.split( '/' );
          path.splice( 2, 0, 'master' );
          url = HOST_RAW_GITHUB + path.join( '/' );

          try {
            fileContent = await httpClient.getAsync( url, false );

            if ( fileContent.statusCode !== 200 )
              FileDownloader.githubDownloadError( new URL( url ).pathname, e );

          } catch ( e ) {
            FileDownloader.githubDownloadError( new URL( url ).pathname, e );
          }
        }

      } catch ( e ) {
        FileDownloader.githubDownloadError( path, e );
      }

      try {
        fileContent = fileContent.body;
        await Utils.saveFileInNodeModules( fileName, fileContent );

        if ( Callback )
          return Callback( fileName );

        resolve( fileName );

      } catch ( e ) {
        FileDownloader.githubDownloadError( path, e );

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
      const NODE_MODULES_PATH = global.config.nodeModulesPath;
      const thisRepoDirName = Utils.buildGithubRepoDirName( user, repo );
      let jsonApiResponse = await FileDownloader.getJsonFromGithubApi( user, repo, pathToFile, branch );
      jsonApiResponse = JSON.parse( jsonApiResponse.body );
      if ( !Array.isArray( jsonApiResponse ) )
        jsonApiResponse = [jsonApiResponse];

      await Utils.mkdir( path_join( NODE_MODULES_PATH, thisRepoDirName ) );
      let currentFileContent = '';
      let currentFilePath = '';

      for ( i = 0; i < jsonApiResponse.length; ++i ) {
        if ( Utils.fileExt( jsonApiResponse[i].name ) !== '.js' )
          continue;

        currentFilePath = path_join( thisRepoDirName, jsonApiResponse[i].path );
        currentFileContent = await httpClient.getAsync( jsonApiResponse[i].download_url );
        await Utils.saveFileInNodeModules( currentFilePath, currentFileContent.body );
        currentFilePath = path_join( NODE_MODULES_PATH, currentFilePath );
        allFilePaths.push( currentFilePath );
      }

      return allFilePaths;

    } catch ( e ) {
      FileDownloader.githubDownloadError( `${user}/${repo}/${pathToFile}`, e );
    }
  }

  static async getJsonFromGithubApi( user, repo, pathToFile, branch = 'master' ) {
    return await httpClient.getAsync( FileDownloader.buildGithubAPIUrl( user, repo, pathToFile, branch ) );
  }

  static buildGithubAPIUrl( user, repo, pathToFile, branch = 'master' ) {
    return `${GITHUB_API_BASE_URL}repos/${user}/${repo}/contents/${pathToFile}?ref=${branch}`;
  }

  static githubDownloadError( filePath, exception ) {
    console.error(
      style.styledError,
      `There was an error while downloading a file from GitHub ("${filePath}"):\nCheck the path name you've inputed.\n\n`,
      exception
    );

    process.exit( 1 );
    process.kill( process.pid, 'SIGINT' );
    setTimeout( () => {
      process.kill( process.pid, 'SIGKILL' );
    }, 5000 );
  }
}

module.exports = FileDownloader;
