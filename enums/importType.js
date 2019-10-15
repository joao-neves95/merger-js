
const ImportType = Object.freeze( {
  Unknown: -1,
  RelativePath: 1,
  NodeModules: 2,
  SpecificURL: 3,
  GitHub: 4
} );

module.exports = ImportType;
