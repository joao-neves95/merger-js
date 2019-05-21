const path = require( 'path' );
const parseImports = require( '../../modules/buildModules/parseImports' );

describe( 'ParseImports', () => {

  it( 'Should parse relative file path imports.', () => {
    parseImports( path.join( __dirname, path.normalize( '../data/headerFiles/relativeFilePaths.header.js' ) ), ( buildOrder ) => {

      expect( buildOrder ).toEqual( jasmine.arrayContaining( ['relativeFilePaths.header.js', '../mockImports.js', '../../tests.js', '../../spec/utils_spec.js'] ) );
    } );
  } );

} );
