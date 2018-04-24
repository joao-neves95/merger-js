'use strict'

module.exports = {
  // Seconds are represented by 2 digits.
  small: () => {
    return new Date().toLocaleString();
  },
  // A complete timestamp (current date and time according to system settings for timezone offset).
  complete: () => {
    return new Date();
  }
}
