/*
 * Copyright (c) 2018-2019 João Pedro Martins Neves - All Rights Reserved.
 *
 * MergerJS (merger-js) is licensed under the MIT license, located in
 * the root of this project, under the name "LICENSE.md".
 *
 */

const StaticClass = require( '../models/staticClassBase' );

class TokenType extends StaticClass {
  constructor() {
    super( 'TokenType' );
  }

  static get importPath_simbol() { return '@'; }
  static get importPath() { return `${TokenType.importPath_simbol}import`; }

  static get importNodeModules_simbol() { return '$'; }
  static get importNodeModules() { return `${TokenType.importNodeModules_simbol}import`; }

  static get importUrl_simbol() { return '%'; }
  static get doubleImportUrl_simbol() { return TokenType.importUrl_simbol + TokenType.importUrl_simbol; }
  static get importUrl() { return `${TokenType.importUrl_simbol}import`; }

  static get push_symbol() { return '<<'; }

  static get push_DIR() { return `${TokenType.push_symbol}DIR`; }
  static get push_DIRECTORY() { return `${TokenType.push_symbol}DIRECTORY`; }
  static get push_dir() { return `${TokenType.push_symbol}dir`; }
  static get push_directory() { return `${TokenType.push_symbol}directory`; }

  static get push_GH() { return `${TokenType.push_symbol}GH`; }
  static get push_gh() { return `${TokenType.push_symbol}gh`; }
  static get push_github() { return `${TokenType.push_symbol}github`; }
  static get push_GITHUB() { return `${TokenType.push_symbol}GITHUB`; }

}

module.exports = Object.freeze( TokenType );
