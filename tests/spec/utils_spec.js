const { removeImportFromInput, removeDirTokenFromImport, removeGithubTokenFromImport } = require( '../../modules/utils' );

const token_push = '<<';
const token_DIR = `${token_push}DIR`;
const token_DIRECTORY = `${token_push}DIRECTORY`;
const token_dir = `${token_push}dir`;
const token_directory = `${token_push}directory`;
const token_GH = `${token_push}GH`;
const token_gh = `${token_push}gh`;
const token_github = `${token_push}github`;
const token_GITHUB = `${token_push}GITHUB`;
const token_importPath_simbol = "@";
const token_importPath = `${token_importPath_simbol}import`;
const token_importNodeModules_simbol = "$";
const token_importNodeModules = `${token_importNodeModules_simbol}import`;
const token_importUrl_simbol = "%";
const token_importUrl = `${token_importUrl_simbol}import`;

const mockImport_DIR = `// ${token_importPath}${token_DIR} 'kdsf/fdjslkg/dfz'`;
const mockImport_dir = `// ${token_importPath}${token_dir} 'kdsf/fdjslkg/dfz'`;
const mockImport_DIRECTORY = `// ${token_importPath}${token_DIRECTORY} 'kdsf/fdjslkg/dfz'`;
const mockImport_directory = `// ${token_importPath}${token_directory} 'kdsf/fdjslkg/dfz'`;

const mockImport_github_DIR = `// ${token_importUrl_simbol}${token_github}${token_DIR} 'https://kdsf/fdjslkg/dfz'`;
const mockImport_GH_dir = `// ${token_importUrl}${token_GH}${token_dir} 'https://kdsf/fdjslkg/dfz'`;

describe( 'Utils', () => {

  it( 'Should remove all "import" tokens types from the import input.', () => {
    expect( removeImportFromInput( mockImport_DIR ) ).not.toContain( token_importPath );
    expect( removeImportFromInput( mockImport_github_DIR ) ).not.toContain( token_importUrl_simbol );
    expect( removeImportFromInput( mockImport_GH_dir ) ).not.toContain( token_importUrl );
  } );

  it( 'Should remove all GITHUB tokens from the import input.', () => {
    expect( removeGithubTokenFromImport( mockImport_github_DIR ) ).not.toContain( token_github );
    expect( removeGithubTokenFromImport( mockImport_GH_dir ) ).not.toContain( token_GH );
  } );

  it( 'Should remove all DIRECTORY tokens from the import input.', () => {
    expect( removeDirTokenFromImport( mockImport_dir ) ).not.toContain( token_dir );
    expect( removeDirTokenFromImport( mockImport_DIR ) ).not.toContain( token_DIR );
    expect( removeDirTokenFromImport( mockImport_github_DIR ) ).not.toContain( token_DIR );
    expect( removeDirTokenFromImport( mockImport_DIRECTORY ) ).not.toContain( token_DIRECTORY );
    expect( removeDirTokenFromImport( mockImport_directory ) ).not.toContain( token_directory );
  } );

} );
