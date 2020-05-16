/*
 * Copyright (c) 2018-2020 João Pedro Martins Neves - All Rights Reserved.
 *
 * MergerJS (merger-js) is licensed under the
 * GPLv3.0 license (GNU General Public License v3.0),
 * located in the root of this project, under the name "LICENSE.md".
 */

module.exports = class StaticClass {
  /**
   * Throws an Error when instantiated.
   * 
   * @param { string } className The class name used in the Error message.
   */
  constructor( className ) {
    throw new Error( `Can not instantiate the static class "${className}".` );
  }

};
