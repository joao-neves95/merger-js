/*
 * Copyright (c) 2018-2020 João Pedro Martins Neves - All Rights Reserved.
 *
 * MergerJS (merger-js) is licensed under the
 * GPLv3.0 license (GNU General Public License v3.0),
 * located in the root of this project, under the name "LICENSE.md".
 */

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
    expect( Utils.removeImportFromInput( MockImports.relative_DIR( RANDOM_PATH_1 ) ) ).not.toContain( TokenType.importPath );
    expect( Utils.removeImportFromInput( MockImports.github_DIR( RANDOM_LINK_1 ) ) ).not.toContain( TokenType.importUrl_simbol );
    expect( Utils.removeImportFromInput( MockImports.GH_dir( RANDOM_LINK_1 ) ) ).not.toContain( TokenType.importUrl );
  } );

  it( 'Should remove all GITHUB tokens from the import input.', () => {
    expect( Utils.removeGithubTokenFromImport( MockImports.github_DIR( RANDOM_LINK_1 ) ) ).not.toContain( TokenType.push_symbol_github );
    expect( Utils.removeGithubTokenFromImport( MockImports.GH_dir( RANDOM_LINK_1 ) ) ).not.toContain( TokenType.push_symbol_GH );
  } );

  it( 'Should remove all DIRECTORY tokens from the import input.', () => {
    expect( Utils.removeDirTokenFromImport( MockImports.relative_dir( RANDOM_PATH_1 ) ) ).not.toContain( TokenType.push_symbol_dir );
    expect( Utils.removeDirTokenFromImport( MockImports.relative_DIR( RANDOM_PATH_1 ) ) ).not.toContain( TokenType.push_symbol_DIR );
    expect( Utils.removeDirTokenFromImport( MockImports.github_DIR( RANDOM_LINK_1 ) ) ).not.toContain( TokenType.push_symbol_DIR );
    expect( Utils.removeDirTokenFromImport( MockImports.relative_DIRECTORY( RANDOM_PATH_1 ) ) ).not.toContain( TokenType.push_symbol_DIRECTORY );
    expect( Utils.removeDirTokenFromImport( MockImports.relative_directory( RANDOM_PATH_1 ) ) ).not.toContain( TokenType.push_symbol_directory );
  } );

  it( 'Should read an entire directory.', async () => {
    const dirPathsArr = await Utils.readDir( __dirname );
    expect( dirPathsArr ).not.toBeNull();
    expect( dirPathsArr ).toBeDefined();
    expect( dirPathsArr ).toEqual( jasmine.arrayContaining( ['httpClient_spec.js', 'parseImports_spec.js', 'minifyCode_spec.js'] ) );
    expect( dirPathsArr.length ).toBeGreaterThanOrEqual( 6 );
  } );

} );
