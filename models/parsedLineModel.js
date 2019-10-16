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
  }

}

module.exports = ParsedLine;
