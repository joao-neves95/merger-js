const path = require( 'path' );
const fs = require( 'fs' );
const parseImports = require( '../../modules/buildModules/parseImports' );
const { fileExists } = require( '../../modules/utils' );

const DATA_DIR_PATH = path.join( __dirname, path.normalize( '../data' ) );
const HEADER_FILES_DIR_PATH = path.join( DATA_DIR_PATH, '/headerFiles' );
const NODE_MODULES_PATH = path.join( DATA_DIR_PATH, '/node_modules' );

describe( 'ParseImports', () => {

  beforeAll( () => {
    global.config = {};
    global.config.nodeModulesPath = NODE_MODULES_PATH;

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
    const thisDownloadedFilePath = path.join( NODE_MODULES_PATH, 'jquery.min.js' );

    return new Promise( ( _resolve, _reject ) => {
      parseImports( path.join( HEADER_FILES_DIR_PATH, 'specificUrlPaths.header.js' ), async ( buildOrder ) => {
        console.debug( buildOrder );
        expect( buildOrder ).not.toBeNull();
        expect( buildOrder ).toBeDefined();
        expect( buildOrder ).toEqual( jasmine.arrayContaining(
          [
            'specificUrlPaths.header.js',
            thisDownloadedFilePath
          ]
        ) );

        let downloadSuccessful = false;
        let downloadFileError = null;

        try {
          downloadSuccessful = await fileExists( thisDownloadedFilePath );

        } catch ( e ) {
          downloadSuccessful = false;
          downloadFileError = e;
        }

        expect( downloadSuccessful ).toEqual( true, 'ParseImports > URL file import > Download file : FAILED, Error:\n' + downloadFileError );

        if ( downloadSuccessful ) {
          fs.readFile( thisDownloadedFilePath, 'utf8', ( err, data ) => {
            expect( err ).toBeNull();
            expect( data ).not.toBeNull();
            expect( data ).toBeDefined();
            expect( data ).not.toEqual( '404: Not Found\n' );
            expect( data.length ).toBeGreaterThan( 50 );

            // Delete the downloaded file.
            fs.unlink( thisDownloadedFilePath, ( err ) => {
              if ( err ) {
                console.error( 'ParseImports > URL file import > (delete downloaded file) : FAILED, Error:' );
                console.error( err );
                return _reject( err );
              }

              return _resolve();
            } );
          } );
        }
      } );
    } );

  } );

} );
