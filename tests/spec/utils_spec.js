const {
  removeImportFromInput,
  removeDirTokenFromImport,
  removeGithubTokenFromImport,
  readDir
} = require( '../../modules/utils' );
const TokenType = require( '../../enums/tokenType' );

const mockImport_DIR = `// ${TokenType.token_importPath}${TokenType.token_DIR} 'kdsf/fdjslkg/dfz'`;
const mockImport_dir = `// ${TokenType.token_importPath}${TokenType.token_dir} 'kdsf/fdjslkg/dfz'`;
const mockImport_DIRECTORY = `// ${TokenType.token_importPath}${TokenType.token_DIRECTORY} 'kdsf/fdjslkg/dfz'`;
const mockImport_directory = `// ${TokenType.token_importPath}${TokenType.token_directory} 'kdsf/fdjslkg/dfz'`;

const mockImport_github_DIR = `// ${TokenType.token_importUrl_simbol}${TokenType.token_github}${TokenType.token_DIR} 'https://kdsf/fdjslkg/dfz'`;
const mockImport_GH_dir = `// ${TokenType.token_importUrl}${TokenType.token_GH}${TokenType.token_dir} 'https://kdsf/fdjslkg/dfz'`;

describe( 'Utils', () => {

  it( 'Should remove all "import" tokens types from the import input.', () => {
    expect( removeImportFromInput( mockImport_DIR ) ).not.toContain( TokenType.token_importPath );
    expect( removeImportFromInput( mockImport_github_DIR ) ).not.toContain( TokenType.token_importUrl_simbol );
    expect( removeImportFromInput( mockImport_GH_dir ) ).not.toContain( TokenType.token_importUrl );
  } );

  it( 'Should remove all GITHUB tokens from the import input.', () => {
    expect( removeGithubTokenFromImport( mockImport_github_DIR ) ).not.toContain( TokenType.token_github );
    expect( removeGithubTokenFromImport( mockImport_GH_dir ) ).not.toContain( TokenType.token_GH );
  } );

  it( 'Should remove all DIRECTORY tokens from the import input.', () => {
    expect( removeDirTokenFromImport( mockImport_dir ) ).not.toContain( TokenType.token_dir );
    expect( removeDirTokenFromImport( mockImport_DIR ) ).not.toContain( TokenType.token_DIR );
    expect( removeDirTokenFromImport( mockImport_github_DIR ) ).not.toContain( TokenType.token_DIR );
    expect( removeDirTokenFromImport( mockImport_DIRECTORY ) ).not.toContain( TokenType.token_DIRECTORY );
    expect( removeDirTokenFromImport( mockImport_directory ) ).not.toContain( TokenType.token_directory );
  } );

  it( 'Should read an entire directory.', async () => {
    const dirPathsArr = await readDir( __dirname );
    expect( dirPathsArr ).toBeDefined();
    expect( dirPathsArr ).not.toBeNull();
    expect( dirPathsArr ).toEqual( jasmine.arrayContaining( ['httpClient_spec.js', 'parseImports_spec.js', 'mergerCLI_specs'] ) );
    expect( dirPathsArr.length ).toBeGreaterThanOrEqual( 6 );
  } );

} );
