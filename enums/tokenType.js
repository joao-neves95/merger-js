class TokenType {
  static get token_push() { return '<<' }
  static get token_DIR() { return `${TokenType.token_push}DIR` }
  static get token_DIRECTORY() { return `${TokenType.token_push}DIRECTORY` }
  static get token_dir() { return `${TokenType.token_push}dir` }
  static get token_directory() { return `${TokenType.token_push}directory` }
  static get token_GH() { return `${TokenType.token_push}GH` }
  static get token_gh() { return `${TokenType.token_push}gh` }
  static get token_github() { return `${TokenType.token_push}github` }
  static get token_GITHUB() { return `${TokenType.token_push}GITHUB` }
  static get token_importPath_simbol() { return "@" }
  static get token_importPath() { return `${TokenType.token_importPath_simbol}import` }
  static get token_importNodeModules_simbol() { return "$" }
  static get token_importNodeModules() { return `${TokenType.token_importNodeModules_simbol}import` }
  static get token_importUrl_simbol() { return "%" }
  static get token_importUrl() { return `${TokenType.token_importUrl_simbol}import` }
}

module.exports = Object.freeze( TokenType );
