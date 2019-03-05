/*
  Copyright (c) 2018 João Pedro Martins Neves <joao95neves@gmail.com> - All Rights Reserved
  Written by João Pedro Martins Neves <joao95neves@gmail.com>

  https://github.com/joao-neves95/Exercises_Challenges_Courses/blob/master/JavaScript/Collections.js

  Class Dictionary(): let dictionary = new Dictionary(uniqueKeys = false)
  Type safe Class List(): let list = new List('string' | 'number' | 'int' | 'float' | 'boolean' | 'any')
*/

class Errors {
  static get existingKey() { throw new Error( 'An item with the same key has already been added.' ); };

  static get noTypeProvided() { throw new Error( 'No type provided on Collection instantiation.' ) };

  static wrongType( type ) { throw new Error( `The value is not from the same type as the List<${type}>` ); };
}

class Collection {
  constructor( uniqueKeys = false, type = 'any' ) {
    this.elements = [];
    this.uniqueKeys = uniqueKeys;

    if ( !type ) throw Errors.noTypeProvided;
    this.type = type;
  }


  get length() {
    return this.elements.length;
  }

  /**
   * (private)
   */
  get __last() {
    return this.elements[this.length - 1];
  }

  /**
   * Get all elements from the Collection.
   * For Dictionary is best to use .getAllValues()
   * 
   * Returns elements[]
   */
  getAll() {
    return this.elements;
  }

  /**
   *
   * @param { number } index
   */
  get( index ) {
    return this.elements[index];
  }

  /**
   * Remove all elements from the Collection.
   */
  clear() {
    this.elements = [];
  }


  /**
   * (private)
   * 
   * @param { Function } Callback <any> in case of a List, or a key/value object <{}> in case of a Dictionary.
   */
  __forEach( Callback ) {
    for ( let i = 0; i < this.elements.length; ++i ) {
      Callback( this.elements[i] );
    }
  }

  /**
   * (private)
   * No type safety. For private class use.
   * @param {Type} value
   */
  push( value ) {
    this.elements.push( value );
  }

  /**
    * (private)
    * No checks. For private class use.
    * @param {Number} index
    */
  splice( index ) {
    this.elements.splice( index, 1 );
  }
}

class Dictionary extends Collection {
  /**
   * Dictionary of key-value pairs.
   * @param {Boolean} uniqueKeys Whether the keys should be unique or not.
   * Optional. It defaults to false
   * @default {false}
   */
  constructor( uniqueKeys ) {
    super( uniqueKeys, 'any' );
  }

  /**
   * Returns the last element of the Dictionary or false.
   *
   * @returns { any }
   */
  get lastValue() {
    try {
      return Object.values( this.__last )[0];

    } catch ( e ) {
      return false;
    }
  }

  getAllValues() {
    let allValues = [];

    for ( let i = 0; i < this.elements.length; ++i ) {
      allValues.push( Object.values( this.elements[i] )[0] );
    }

    return allValues;
  }


  add( key, value ) {
    if ( this.uniqueKeys ) {
      if ( this.findIndexOfKey( key ) !== false )
        throw new Error( Errors.existingKey );
    }

    this.push( { [key]: value } );
  }

  /*
   * Removes an item in the Dictionary with the provided key.
   * @return { bool }
   */
  remove( key ) {
    const index = this.findIndexOfKey( key );
    if ( index === false )
      return false;

    this.splice( index, 1 );
    return true;
  }

  /*
   * Updates an item in the Dictionary with the provided key.
   * @param { any } key
   * @param { any } newValue
   * @return { bool }
   */
  updateByKey( key, newValue ) {
    const index = this.findIndexOfKey( key );
    if ( index === false )
      return false;

    return this.updateByIndex( index, newValue );
  }
  /*
   * Updates an item in the Dictionary with the provided index.
   * @param { any } key
   * @param { any } newValue
   * @return { bool }
   */

  updateByIndex( idx, newValue ) {
    try {
      Object.defineProperty( this.elements[idx], key, {
        value: newValue
      } );

      return true;

    } catch ( e ) {
      return false;
    }
  }

  /**
   * Get a value with its index. Returns an array with the values.
   * @param {number} index
   * @return {any[]}
   */
  getByIndex( index ) {
    return Object.values( this.elements[index] )[0];
  }

  /**
   * Get a key with its index.
   * @param {number} index
   * @return {any}
   */
  getKeyByIndex( index ) {
    return Object.keys( this.elements[index] )[0];
  }

  /**
   * Returns the value by key or <false> if not found.
   * @param { any } key
   * @returns { any | false }
   */
  getByKey( key ) {
    try {
      const keyIdx = this.findIndexOfKey( key );

      if ( keyIdx === false )
        return false;

      return this.elements[keyIdx][key];

    } catch ( e ) {
      console.error( e );
    }
  }

  findIndexOfKey( key ) {
    for ( let i = 0; i < this.elements.length; i++ ) {
      if ( Object.keys( this.elements[i] )[0] === key )
        return i;
    }

    return false;
  }

  forEachValue( Callback ) {
    this.__forEach( ( item ) => {
      Callback( Object.values( item )[0] );
    } );
  }
}

// Type safe list.
class List extends Collection {
  /**
   * 
   * The Type of the list.
   * ('string' | 'number' | 'int' | 'float' | 'boolean' | 'any')
   * @param {String} type
   */
  constructor( type ) {
    super( false, type );
  }

  /**
   * Returns the last element of the List or false.
   *
   * @returns { any }
   */
  get last() {
    try {
      return this.__last;

    } catch ( e ) {
      return false;
    }
  }

  /**
   * Add a new item to the List<T>.
   * @param {Type} value
   */
  add( value ) {
    switch ( this.type ) {
      case 'any':
        return this.push( value );
      case 'int':
        if ( this.isInt( value ) ) {
          return this.push( value );
        }
        break;
      case 'float':
        if ( this.isFloat( value ) ) {
          return this.push( value );
        }
        break;
      default:
        if ( typeof value === this.type )
          return this.push( value );
        break;
    }

    throw Errors.wrongType( this.type );
  }

  /**
   * Remove an new item from the List<T> by index.
   * @param {Number} index
   */
  remove( index ) {
    this.splice( index );
  }

  forEach( Callback ) {
    this.__forEach( ( item ) => {
      Callback( item );
    } );
  }

  /**
   * (private)
   * @param {Number} value
   */
  isInt( value ) {
    if ( typeof value !== 'number' )
      return false;

    return value % 1 === 0;
  }

  /**
   * (private)
   * @param {Number} value
   */
  isFloat( value ) {
    if ( typeof value !== 'number' )
      return false;

    return value % 1 !== 0;
  }
}

module.exports = { Dictionary, List };
