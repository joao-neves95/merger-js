/*
 * Copyright (c) 2018-2019 João Pedro Martins Neves - All Rights Reserved.
 *
 * MergerJS (merger-js) is licensed under the MIT license, located in
 * the root of this project, under the name "LICENSE.md".
 *
 */

const StaticClass = require( '../../models/staticClassBase' );
const TokenType = require( '../../enums/tokenType' );

module.exports = class MockImports extends StaticClass {
  constructor() {
    super( 'MockImports' );
  }

  static relative_DIR( path ) { return `// ${TokenType.importPath}${TokenType.push_DIR} '${path}'`; }
  static relative_dir( path ) { return `// ${TokenType.importPath}${TokenType.push_dir} '${path}'`; }
  static relative_DIRECTORY( path ) { return `// ${TokenType.importPath}${TokenType.push_DIRECTORY} '${path}'`; }
  static relative_directory( path ) { return `// ${TokenType.importPath}${TokenType.push_directory} '${path}'`; }

  static github_DIR( path ) { return `// ${TokenType.importUrl_simbol}${TokenType.push_github}${TokenType.push_DIR} '${path}'` }
  static GH_dir( path ) { return `// ${TokenType.importUrl}${TokenType.push_GH}${TokenType.push_dir} '${path}'` }

};
