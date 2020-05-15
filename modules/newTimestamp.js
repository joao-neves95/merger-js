/*
 * Copyright (c) 2018-2020 João Pedro Martins Neves - All Rights Reserved.
 *
 * MergerJS (merger-js) is licensed under the MIT license, located in
 * the root of this project, under the name "LICENSE.md".
 *
 */

'use strict';

const StaticClass = require( '../models/staticClassBase' );

/** (static) class for getting timestamp. */
class NewTimestamp extends StaticClass {

  constructor() {
    super( NewTimestamp.name );
  }

  /** No milliseconds. */
  static small() {
    const newTimestamp = new Date();
    return newTimestamp.toLocaleString();
  }

  /** Seconds are represented by 2 digits. */
  static big() {
    const newTimestamp = new Date();
    const milli = newTimestamp.getMilliseconds().toString();
    return newTimestamp.toLocaleString() + '.' + milli.substr( 0, 2 );
  }

  /** Seconds are represented by 3 digits. */
  static max() {
    const newTimestamp = new Date();
    const milli = newTimestamp.getMilliseconds().toString();
    return newTimestamp.toLocaleString() + '.' + milli;
  }

  /** A complete timestamp (current date and time according to system settings for timezone offset). */
  static complete() {
    return new Date();
  }

  static completeLocale() {
    return new Date( NewTimestamp.complete().toLocaleString() );
  }

  /** 
   * 
   * @param { number } amount The amount of months from now.
   */
  static monthsFromNow( amount ) {
    return addMonthsToDate( NewTimestamp.complete(), amount );
  }

  /** 
   * 
   * @param { Date | string | number } date
   * @param { number } amount
   */
  static addMonthsToDate( date, amount ) {
    date = new Date( date );
    date.setMonth( date.getMonth() + amount );
    return date;
  }

  /** 
   * 
   * @param { number } amount The amount of days from now.
   */
  static daysFromNow( amount ) {
    return addDaysToDate( NewTimestamp.complete(), amount );
  }

  /**
   * 
   * @param { Date | string | number } date
   * @param { number } amount
   */
  static addDaysToDate( date, amount ) {
    date = new Date( date );
    date.setDate( date.getDate() + amount );
    return date;
  }
}

module.exports = NewTimestamp;
