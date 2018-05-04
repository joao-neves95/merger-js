'use strict'

class UserConfig {
  constructor (uglify, autoBuild, notifications) {
    this.mergerJsLinks = {
      npm: 'https://www.npmjs.com/package/merger-js',
      github: 'https://github.com/joao-neves95/merger-js',
      readme: 'https://github.com/joao-neves95/merger-js/blob/master/README.md',
      changelog: 'https://github.com/joao-neves95/merger-js/blob/master/CHANGELOG.md'
    }
    this.uglify = uglify;
    this.autoBuild = autoBuild;
    this.notifications = notifications;
    this.sourceFiles = [];
  }
}

module.exports = UserConfig;
