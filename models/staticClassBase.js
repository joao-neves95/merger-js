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
