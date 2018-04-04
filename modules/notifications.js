'use strict'
const notifier = require('../node_modules/node-notifier');
const progInfo = '\n\nMergerJS';

// sound - Only Notification Center or Windows Toasters
module.exports = {
  notif: (title, message) => {
    notifier.notify({
      title: title,
      message: message + progInfo,
      sound: true,
      wait: true
    });
  }
}
