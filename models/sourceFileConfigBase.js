/*
 * Copyright (c) 2018-2020 João Pedro Martins Neves - All Rights Reserved.
 *
 * MergerJS (merger-js) is licensed under the MIT license, located in
 * the root of this project, under the name "LICENSE.md".
 *
 */

'use string';

class SourceFileConfigBase {

  constructor( uglify ) {
    this.uglify = uglify === undefined || uglify === null ? true : uglify;
  }

}

module.exports = SourceFileConfigBase;
