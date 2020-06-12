/*
 * Copyright (c) 2018-2020 João Pedro Martins Neves - All Rights Reserved.
 *
 * MergerJS (merger-js) is licensed under the
 * GPLv3.0 license (GNU General Public License v3.0),
 * located in the root of this project, under the name "LICENSE.md".
 */

const ImportType = require( '../enums/importType' );

class ParsedLine {

  constructor() {
    /**
     * @type { boolean }
     */
    this.isComment = null;

    /**
     * @type { boolean }
     */
    this.isDir = false;

    /** ImportType enum
     * @type { number } ImportType enum
     */
    this.importType = ImportType.Unknown;

    /**
     * @type { boolean }
     */
    this.forceInstall = false;

    /**
     * @type { string | null }
     */
    this.path = null;

    /**
     * @type { string | null }
     */
    this.directory = null;

    /**
     * @type { string | null }
     */
    this.branchName = null;

    /**
     * @type { boolean | null }
     **/
    this.isGithubNewSyntax = null;

    /**
     * @type { string | null }
     */
    this.headerFilePath = null;
  }

}

module.exports = ParsedLine;
