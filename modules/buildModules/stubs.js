/*
 * Copyright (c) 2018-2020 João Pedro Martins Neves - All Rights Reserved.
 *
 * MergerJS (merger-js) is licensed under the
 * GPLv3.0 license (GNU General Public License v3.0),
 * located in the root of this project, under the name "LICENSE.md".
 */

'use strict'
const StaticClass = require( '../../models/staticClassBase' );

class Stubs extends StaticClass {

  constructor() {
    super( Stubs.name );
  }

  /**
   *
   * @static
   * @param { string } namespace The namespace where all the modules belong (the name of the build file).
   * @param { string } moduleName This module name.
   * @param { string[] } requires An array with all the module names to require, or an empty array.
   * @param { string } content The class/function/object to export.
   * @param { string } contentName The name of the class/function/object to export.
   * @returns
   * @memberof Stubs
   */
  static RenderUMDBlock(namespace, moduleName, requires, content, contentName) {
    return `

(function (root, factory) {
  if ( typeof define === 'function' && define.amd ) {
    // AMD.
    define( '${moduleName}', ${requires}, factory );

  } else if ( typeof module === 'object' && module.exports ) {
    // CommonJS (Node.js).
    ${requires.length === 0 ? '' : `const lib = require( \'./${namespace}\' );` }
    module.exports['${moduleName}'] = factory( ${Stubs.____renderRequires(requires, 'lib')} );

  } else {
    // Browser.
    root.['${moduleName}'] = factory( ${Stubs.#renderRequires(requires, 'root')} );
  }
})( typeof global !== 'undefined' ? global : this.window || this.global, function( ${Stubs.#renderRequires(requires)} ) {
      ${content}
      return ${contentName};
} );

`;

  }

  /**
   *
   * @private
   * @param { string[] } requires
   * @param { string | null } namespaceObjName
   * @memberof Stubs
   */
  static ____renderRequires(requires, namespaceObjName = null) {
    js = '';

    for (let i = 0; i < requires.length; ++i) {
      js += !namespaceObjName ? requires[i] : `${namespaceObjName}['${requires[i]}']`;

      if (i < requires.length - 1) {
        js += ', ';
      }
    }

    return js;
  }

}

module.exports = Stubs;
