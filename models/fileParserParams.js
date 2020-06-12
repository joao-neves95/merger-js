
class FileParserParams {

  constructor(filePath, isHeaderFile = true, parseImports = true) {
    /** @type { string } */
    this.filePath = filePath;

    /** @type { boolean } */
    this.isHeaderFile = isHeaderFile;

    /** @type { boolean } */
    this.parseImports = parseImports;
  }

  get maxLineCount() {
    return this.isHeaderFile ? 20 : 5;
  }

}

module.exports = FileParserParams;
