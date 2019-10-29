'use string';

class SourceFileConfigBase {

  constructor( uglify ) {
    this.uglify = uglify === undefined || uglify === null ? true : uglify;
  }

}

module.exports = SourceFileConfigBase;
