const Utils = require( '../../modules/utils' );
const TokenType = require( '../../enums/tokenType' );
const MockImports = require( '../data/mockImports' );

const RANDOM_PATH_1 = 'kdsf/fdjslkg/dfz';
const RANDOM_LINK_1 = `https://${RANDOM_PATH_1}`;

describe( 'Utils', () => {

  it( 'Should throw Error (static class)', () => {
    expect( () => { new Utils(); } ).toThrowError( null );
  } );

  it( 'Should remove all "import" tokens types from the import input.', () => {
    expect( Utils.removeImportFromInput( MockImports.relative_DIR( RANDOM_PATH_1 ) ) ).not.toContain( TokenType.token_importPath );
    expect( Utils.removeImportFromInput( MockImports.github_DIR( RANDOM_LINK_1 ) ) ).not.toContain( TokenType.token_importUrl_simbol );
    expect( Utils.removeImportFromInput( MockImports.GH_dir( RANDOM_LINK_1 ) ) ).not.toContain( TokenType.token_importUrl );
  } );

  it( 'Should remove all GITHUB tokens from the import input.', () => {
    expect( Utils.removeGithubTokenFromImport( MockImports.github_DIR( RANDOM_LINK_1 ) ) ).not.toContain( TokenType.token_github );
    expect( Utils.removeGithubTokenFromImport( MockImports.GH_dir( RANDOM_LINK_1 ) ) ).not.toContain( TokenType.token_GH );
  } );

  it( 'Should remove all DIRECTORY tokens from the import input.', () => {
    expect( Utils.removeDirTokenFromImport( MockImports.relative_dir( RANDOM_PATH_1 )) ).not.toContain( TokenType.token_dir );
    expect( Utils.removeDirTokenFromImport( MockImports.relative_DIR( RANDOM_PATH_1 ) ) ).not.toContain( TokenType.token_DIR );
    expect( Utils.removeDirTokenFromImport( MockImports.github_DIR( RANDOM_LINK_1 ) ) ).not.toContain( TokenType.token_DIR );
    expect( Utils.removeDirTokenFromImport( MockImports.relative_DIRECTORY( RANDOM_PATH_1 ) ) ).not.toContain( TokenType.token_DIRECTORY );
    expect( Utils.removeDirTokenFromImport( MockImports.relative_directory( RANDOM_PATH_1 ) ) ).not.toContain( TokenType.token_directory );
  } );

  it( 'Should read an entire directory.', async () => {
    const dirPathsArr = await Utils.readDir( __dirname );
    expect( dirPathsArr ).not.toBeNull();
    expect( dirPathsArr ).toBeDefined();
    expect( dirPathsArr ).toEqual( jasmine.arrayContaining( ['httpClient_spec.js', 'parseImports_spec.js', 'mergerCLI_specs'] ) );
    expect( dirPathsArr.length ).toBeGreaterThanOrEqual( 6 );
  } );

} );
