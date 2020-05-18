/*
 * Copyright (c) 2018-2020 João Pedro Martins Neves - All Rights Reserved.
 *
 * MergerJS (merger-js) is licensed under the
 * GPLv3.0 license (GNU General Public License v3.0),
 * located in the root of this project, under the name "LICENSE.md".
 */

'use string';

class SourceFileConfigBase {

  constructor( uglify ) {
    this.uglify = uglify === undefined || uglify === null ? true : uglify;
  }

}

module.exports = SourceFileConfigBase;
