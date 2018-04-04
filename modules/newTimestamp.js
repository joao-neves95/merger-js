'use strict'
const newTimeStamp = new Date();
const newDate = newTimeStamp.toISOString().substr(0, 10);

module.exports = {
  // No seconds.
  tiny: () => {
    const date = newDate;
    const time = newTimeStamp.toISOString().substr(11, 5);
    return date + ' ' + time;
  },
  // Seconds are represented by 2 digits.
  small: () => {
    const date = newDate;
    const time = newTimeStamp.toISOString().substr(11, 8);
    return date + ' ' + time;
  },
  // Seconds are represented by 3 digits.
  max: () => {
    const date = newDate;
    const time = newTimeStamp.toISOString().substr(11, 12);
    return date + ' ' + time;
  },
  // A complete timestamp (current date and time according to system settings for timezone offset).
  complete: () => {
    return newTimeStamp;
  }
}
