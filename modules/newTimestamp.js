/*
 * Copyright (c) 2018-2019 João Pedro Martins Neves - All Rights Reserved.
 *
 * MergerJS (merger-js) is licensed under the MIT license, located in
 * the root of this project, under the name "LICENSE.md".
 *
 */

'use strict'

module.exports = {
  /** No milliseconds. */
  small: () => {
    const newTimestamp = new Date();
    const milli = newTimestamp.getMilliseconds().toString();
    return newTimestamp.toLocaleString();
  },
  /** Seconds are represented by 2 digits. */
  big: () => {
    const newTimestamp = new Date();
    const milli = newTimestamp.getMilliseconds().toString();
    return newTimestamp.toLocaleString() + '.' + milli.substr( 0, 2 );
  },
  /** Seconds are represented by 3 digits. */
  max: () => {
    const newTimestamp = new Date();
    const milli = newTimestamp.getMilliseconds().toString();
    return newTimestamp.toLocaleString() + '.' + milli;
  },
  /** A complete timestamp (current date and time according to system settings for timezone offset). */
  complete: () => {
    return new Date();
  },

  /** 
   * 
   * @param { number } amount The amount of months from now.
   */
  monthsFromNow: ( amount ) => {
    return addMonthsToDate( complete(), amount );
  },

  /** 
   * 
   * @param { Date | string | number } date
   * @param { number } amount
   */
  addMonthsToDate: ( date, amount ) => {
    date = new Date( date );
    date.setMonth( date.getMonth() + amount );
    return date;
  },

  /** 
   * 
   * @param { number } amount The amount of days from now.
   */
  daysFromNow: ( amount ) => {
    return addDaysToDate( complete(), amount );
  },

  /**
   * 
   * @param { Date | string | number } date
   * @param { number } amount
   */
  addDaysToDate: ( date, amount ) => {
    date = new Date( date );
    date.setDate( date.getDate() + amount );
    return date;
  }
};
