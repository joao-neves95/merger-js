/*
 * Copyright (c) 2018-2019 João Pedro Martins Neves - All Rights Reserved.
 *
 * MergerJS (merger-js) is licensed under the MIT license, located in
 * the root of this project, under the name "LICENSE.md".
 *
 */

const ImportType = Object.freeze( {
  Unknown: -1,
  RelativePath: 1,
  NodeModules: 2,
  SpecificURL: 3,
  GitHub: 4
} );

module.exports = ImportType;
