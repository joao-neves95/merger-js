/*
 * Copyright (c) 2018-2020 João Pedro Martins Neves - All Rights Reserved.
 *
 * MergerJS (merger-js) is licensed under the MIT license, located in
 * the root of this project, under the name "LICENSE.md".
 *
 */

const path = require( 'path' );
const fs = require( 'fs' );
const parseImports = require( '../../modules/buildModules/parseImports' );
const Utils = require( '../../modules/utils' );
const DATA_DIR_PATH = path.join( __dirname, path.normalize( '../data' ) );
const HEADER_FILES_DIR_PATH = path.join( DATA_DIR_PATH, '/headerFiles' );
const NODE_MODULES_PATH = path.join( DATA_DIR_PATH, '/node_modules' );

describe( 'ParseImports', () => {

  let originalTimeout;

  beforeAll( () => {
    global.config = {};
    global.config.nodeModulesPath = NODE_MODULES_PATH;
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 50000;

  } );

  it( 'Should parse file path imports, relative to the header file.', () => {

    parseImports( path.join( HEADER_FILES_DIR_PATH, 'relativeFilePaths.header.js' ), ( buildOrder ) => {
      expect( buildOrder ).not.toBeNull();
      expect( buildOrder ).toBeDefined();
      expect( buildOrder ).toEqual( jasmine.arrayContaining(
        [
          'relativeFilePaths.header.js',
          path.normalize( '../mockImports.js' ),
          path.normalize( '../../tests.js' ),
          path.normalize( '../../spec/utils_spec.js' )
        ]
      ) );
    } );
  } );

  it( 'Should parse relative directories path imports, relative to the header file', () => {

    parseImports( path.join( HEADER_FILES_DIR_PATH, 'relativeDirPaths.header.js' ), ( buildOrder ) => {
      expect( buildOrder ).not.toBeNull();
      expect( buildOrder ).toBeDefined();
      expect( buildOrder ).toEqual( jasmine.arrayContaining(
        [
          path.normalize( 'relativeDirPaths.header.js' ),
          path.normalize( '../node_modules/randomFile1.js' ),
          path.normalize( '../node_modules/randomFile2.js' ),
          path.normalize( '../node_modules/randomFile3.js' ),
          path.normalize( '../node_modules/randomDir1/randomFile1.js' ),
          path.normalize( '../node_modules/randomDir1/randomFile2.js' ),
          path.normalize( '../node_modules/randomDir1/randomFile3.js' )
        ]
      ) );
    } );
  } );

  it( 'Should parse file paths relative to the node_modules folder.', () => {

    parseImports( path.join( HEADER_FILES_DIR_PATH, 'nodeModulesFilePaths.header.js' ), ( buildOrder ) => {
      expect( buildOrder ).not.toBeNull();
      expect( buildOrder ).toBeDefined();
      expect( buildOrder ).toEqual( jasmine.arrayContaining(
        [
          'nodeModulesFilePaths.header.js',
          path.join( NODE_MODULES_PATH, 'randomFile1.js' ),
          path.join( NODE_MODULES_PATH, 'randomFile2.js' ),
          path.join( NODE_MODULES_PATH, 'randomDir1/randomFile1.js' ),
          path.join( NODE_MODULES_PATH, 'randomFile3.js' )
        ]
      ) );

      expect( buildOrder[3] ).toEqual( path.join( NODE_MODULES_PATH, 'randomDir1/randomFile1.js' ) );
    } );
  } );

  it( 'Should parse a URL file import, download the file and cache it in the node_modules folder.', async () => {
    const filePath = path.join( NODE_MODULES_PATH, 'jquery.min.js' );
    await __parseImportsUrlsTest( 'specificUrlPaths.header.js', [filePath] );
    await Utils.deleteFile( filePath );
  } );

  it( 'Should parse a GitHub file path, download it and cache it into the node_modules folder.', async () => {
    await ____removeBootsrapFolder( await __parseImportsUrlsTest(
      'githubFilePath.header.js',
      [path.join( NODE_MODULES_PATH, 'twbs@bootstrap/dist/js/bootstrap.min.js' )]
    ) );
  } );

  it( 'Should parse an entire GitHub directory path, download it and cache it into the node_modules folder.\n' +
      'After that, it should parse an existing GitHub directory path cached in the node_modules folder, not downloading it.',
    async () => {
      const headerFilePath = 'githubDirPath.header.js';
      const cacheFolderPath = path.join( NODE_MODULES_PATH, 'twbs@bootstrap/dist/js/' );

      await __parseImportsUrlsTest( headerFilePath,
        [
          path.join( NODE_MODULES_PATH, 'twbs@bootstrap/dist/js/bootstrap.js' ),
          path.join( NODE_MODULES_PATH, 'twbs@bootstrap/dist/js/bootstrap.min.js' ),
          path.join( NODE_MODULES_PATH, 'twbs@bootstrap/dist/js/bootstrap.esm.min.js' ),
          path.join( NODE_MODULES_PATH, 'twbs@bootstrap/dist/js/bootstrap.esm.js' ),
          path.join( NODE_MODULES_PATH, 'twbs@bootstrap/dist/js/bootstrap.bundle.js' ),
          path.join( NODE_MODULES_PATH, 'twbs@bootstrap/dist/js/bootstrap.bundle.min.js' )
        ]
      );

      const buildOrder = await parseImports( path.join( HEADER_FILES_DIR_PATH, headerFilePath ) );

      const stats = await Utils.fsStat( buildOrder[1] );

      expect( stats.mtime ).toEqual( stats.ctime );
      expect( stats.mtimeMs ).toEqual( stats.ctimeMs );
      
      const allFileNames = await Utils.readDir( cacheFolderPath );
      allFileNames.forEach( ( item, i ) => {
        allFileNames[i] = cacheFolderPath + item;
      } );
      
      await ____removeBootsrapFolder( allFileNames );
    }
  );

  afterAll( () => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
  } );

} );

// #region HELPER FUNCTIONS

/**
 * Checks if the files exists to confirm if it was successfull.
 * 
 * @param { string } headerFile The header file path, with all the imports.
 * @param { string[] } downloadedFilePaths The path location where the downloaded file should be.
 * 
 * @return { Promise<string[] | Error> }
 */
const __parseImportsUrlsTest = ( headerFile, downloadedFilePaths ) => {
  return new Promise( ( _resolve, _reject ) => {

    parseImports( path.join( HEADER_FILES_DIR_PATH, headerFile ), async ( buildOrder ) => {
      const expectedOutput = [headerFile].concat( downloadedFilePaths );
      expect( buildOrder ).not.toBeNull();
      expect( buildOrder ).toBeDefined();
      expect( buildOrder ).toEqual( jasmine.arrayContaining( expectedOutput ) );

      let downloadSuccessful = false;
      let downloadFileError = null;
      let currentLink = '';

      try {
        for ( let i = 0; i < downloadedFilePaths.length; ++i ) {
          currentLink = downloadedFilePaths[i];
          downloadSuccessful = await Utils.fileExists( downloadedFilePaths[i] );

          if ( !downloadSuccessful ) {
            break;
          }
        }

      } catch ( e ) {
        downloadSuccessful = false;
        downloadFileError = e;
      }

      expect( downloadSuccessful ).toEqual( true, `ParseImports > URL file import > URL: ${currentLink} ; Download file : FAILED, Error:\n ${downloadFileError}` );

      if ( downloadSuccessful ) {

        const ____validateFileAsync = ( downloadedFilePath ) => {
          return new Promise( ( _res, _rej ) => {

            fs.readFile( downloadedFilePath, 'utf8', ( err, data ) => {
              if ( err )
                return _rej( err );

              expect( data ).not.toBeNull();
              expect( data ).toBeDefined();
              expect( data ).not.toEqual( '404: Not Found\n' );
              expect( data.length ).toBeGreaterThan( 50 );

              return _res();
            } );

          } );
        };

        for ( let i = 0; i < downloadedFilePaths.length; ++i ) {
          await ____validateFileAsync( downloadedFilePaths[i] );
        }

        return _resolve( downloadedFilePaths );
      }

      return _reject( downloadFileError );
    } );

  } );
};

const ____removeBootsrapFolder = ( allFiles ) => {
  return new Promise( async ( _res, _rej ) => {
    // This is orrible and all hardcoded as #uck.
    // TODO: Redo this test data removal part.

    for ( let i = 0; i < allFiles.length; ++i ) {
      await Utils.deleteFile( allFiles[i] );
    }

    fs.rmdir( path.join( NODE_MODULES_PATH, 'twbs@bootstrap/dist/js' ), ( err ) => {
      fs.rmdir( path.join( NODE_MODULES_PATH, 'twbs@bootstrap/dist/' ), ( errr ) => {
        fs.rmdir( path.join( NODE_MODULES_PATH, 'twbs@bootstrap/' ), ( errrr ) => {
          if ( err || errr || errrr ) {
            console.error( 'ParseImports > URL file import > (delete downloaded file) : FAILED, Error:' );
            console.error( err || errr || errrr );
            return _rej( err || errr || errrr );
          }

          return _res();
        } );
      } );
    } );

  } );
};

// #endregion HELPER FUNCTIONS
