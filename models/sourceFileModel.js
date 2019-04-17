/*
 * Copyright (c) 2018-2019 João Pedro Martins Neves - All Rights Reserved.
 *
 * MergerJS (merger-js) is licensed under the MIT license, located in
 * the root of this project, under the name "LICENSE.md".
 *
 */

'use strict';

class SourceFileModel {
  constructor() {
    this.source = '';

    this.output = {
      path: '',
      name: ''
    };
  }
}

module.exports = SourceFileModel;
