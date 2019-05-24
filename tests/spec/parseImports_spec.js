const path = require( 'path' );
const parseImports = require( '../../modules/buildModules/parseImports' );

const DATA_DIR_PATH = path.join( __dirname, path.normalize( '../data' ) );
const HEADER_FILES_DIR_PATH = path.join( DATA_DIR_PATH, '/headerFiles' );
const NODE_MODULES_PATH = path.join( DATA_DIR_PATH, '/node_modules' );

describe( 'ParseImports', () => {

  beforeAll( () => {
    global.config = {};
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
    global.config.nodeModulesPath = NODE_MODULES_PATH;

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
    global.config.nodeModulesPath = NODE_MODULES_PATH;

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

  // TODO: (Tests) Add parse dir paths relative to the node_modules folder.

} );
