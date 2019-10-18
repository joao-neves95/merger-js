/*
 * Copyright (c) 2018-2019 João Pedro Martins Neves - All Rights Reserved.
 *
 * MergerJS (merger-js) is licensed under the MIT license, located in
 * the root of this project, under the name "LICENSE.md".
 *
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
