'use strict'
const notifier = require('../node_modules/node-notifier');
const progInfo = '\n\nMergerJS';

// sound - Only Notification Center or Windows Toasters
module.exports = {
  notif: (title, message) => {
    if (global.config.notifications === undefined)
      global.config.notifications = true;

    if (!global.config.notifications)
      return

    notifier.notify({
      title: title,
      message: message + progInfo,
      sound: true,
      wait: true
    });
  }
}
