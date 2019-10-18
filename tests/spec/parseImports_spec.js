const path = require( 'path' );
const fs = require( 'fs' );
const parseImports = require( '../../modules/buildModules/parseImports' );
const { fileExists } = require( '../../modules/utils' );

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

  // TODO: (Tests) Add the token tests on all the buildOrder files output (reuse between utils_spec.js).

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
    await __parseImportsUrlsTest( 'specificUrlPaths.header.js', [path.join( NODE_MODULES_PATH, 'jquery.min.js' )] );
  } );

  it( 'Should parse a GitHub file path, download it and cache it into the node_modules folder.', async () => {
    await __parseImportsUrlsTest( 'githubFilePath.header.js', [path.join( NODE_MODULES_PATH, 'twbs@bootstrap/dist/js/bootstrap.min.js' )] );
    await ____removeBootsrapFolder();
  } );

  it( 'Should parse an entire GitHub directory path, download it and cache it into the node_modules folder.', async () => {
    await __parseImportsUrlsTest( 'githubDirPath.header.js',
      [
        path.join( NODE_MODULES_PATH, 'twbs@bootstrap/dist/js/bootstrap.js' ),
        path.join( NODE_MODULES_PATH, 'twbs@bootstrap/dist/js/bootstrap.min.js' ),
        path.join( NODE_MODULES_PATH, 'twbs@bootstrap/dist/js/bootstrap.esm.min.js' ),
        path.join( NODE_MODULES_PATH, 'twbs@bootstrap/dist/js/bootstrap.esm.js' ),
        path.join( NODE_MODULES_PATH, 'twbs@bootstrap/dist/js/bootstrap.bundle.js' ),
        path.join( NODE_MODULES_PATH, 'twbs@bootstrap/dist/js/bootstrap.bundle.min.js' )
      ]
    );

    await ____removeBootsrapFolder();
  } );

  afterAll( () => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
  } );

} );

/**
 * 
 * @param { string } headerFile The header file path, with all the imports.
 * @param { string[] } downloadedFilePaths The path location where the downloaded file should be.
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
          downloadSuccessful = await fileExists( downloadedFilePaths[i] );

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
                return _reject( err );

              expect( data ).not.toBeNull();
              expect( data ).toBeDefined();
              expect( data ).not.toEqual( '404: Not Found\n' );
              expect( data.length ).toBeGreaterThan( 50 );

              // Delete the downloaded file.
              fs.unlink( downloadedFilePath, ( err ) => {
                if ( err ) {
                  console.error( 'ParseImports > URL file import > (delete downloaded file) : FAILED, Error:' );
                  console.error( err );
                  return _rej( err );
                }

                return _res();
              } );
            } );
          } );
        };

        for ( let i = 0; i < downloadedFilePaths.length; ++i ) {
          await ____validateFileAsync( downloadedFilePaths[i] );
        }

        return _resolve();
      }

      return _reject( downloadFileError );
    } );

  } );
};

const ____removeBootsrapFolder = () => {
  return new Promise( ( _res, _rej ) => {
    // This is orrible and all hardcoded as #uck.
    // TODO: Redo this test data removal part.
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
