const StaticClass = require( '../../models/staticClassBase' );
const TokenType = require( '../../enums/tokenType' );

module.exports = class MockImports extends StaticClass {
  constructor() {
    super( 'MockImports' );
  }

  static relative_DIR( path ) { return `// ${TokenType.token_importPath}${TokenType.token_DIR} '${path}'`; }
  static relative_dir( path ) { return `// ${TokenType.token_importPath}${TokenType.token_dir} '${path}'`; }
  static relative_DIRECTORY( path ) { return `// ${TokenType.token_importPath}${TokenType.token_DIRECTORY} '${path}'`; }
  static relative_directory( path ) { return `// ${TokenType.token_importPath}${TokenType.token_directory} '${path}'`; }

  static github_DIR( path ) { return `// ${TokenType.token_importUrl_simbol}${TokenType.token_github}${TokenType.token_DIR} '${path}'` }
  static GH_dir( path ) { return `// ${TokenType.token_importUrl}${TokenType.token_GH}${TokenType.token_dir} '${path}'` }

};
