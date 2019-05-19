﻿const minifyCode = require( '../../modules/buildModules/minifyCode' );

const UNMINIFIED_CODE = 'function f(a, b, x, y) { return a < b && x > y; }';
const MINIFIED_CODE = 'function f(n,f,r,t){return n<f&&r>t}';

describe( 'MinifyCode', () => {

  beforeAll( () => {
    global.config = {};
  } );

  it( '(uglify = true) Should minify a basic JavaScript code string', () => {
    global.config.uglify = true;
    global.minifyOptions = {
      warnings: false
    };

    minifyCode( UNMINIFIED_CODE, ( outputCode ) => {
      expect( outputCode ).not.toBeUndefined();
      expect( outputCode ).not.toBeNull();
      expect( outputCode ).toBe( MINIFIED_CODE );
    } );
  } );

  it( '(uglify = false) Should **NOT** minify a JavaScript code string', () => {
    global.config.uglify = false;

    minifyCode( UNMINIFIED_CODE, ( outputCode ) => {
      expect( outputCode ).not.toBeUndefined();
      expect( outputCode ).not.toBeNull();
      expect( outputCode ).toBe( UNMINIFIED_CODE );
    } );
  } );

} );