
const ImportType = Object.freeze( {
  Unknown: -1,
  RelativePath: 1,
  NodeModules: 2,
  URL: 3,
  GitHub: 4
} );

module.exports = ImportType;
