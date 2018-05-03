'use strict'

class buildFile {
  constructor (source, path, name) {
    this.source = source;
    this.output = {
      path: path,
      name: name
    }
  }
}

module.exports = buildFile;
