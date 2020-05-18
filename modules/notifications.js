/*
 * Copyright (c) 2018-2020 João Pedro Martins Neves - All Rights Reserved.
 *
 * MergerJS (merger-js) is licensed under the
 * GPLv3.0 license (GNU General Public License v3.0),
 * located in the root of this project, under the name "LICENSE.md".
 */

'use strict';
const notifier = require('../node_modules/node-notifier');
const progInfo = '\n\nMergerJS';

// sound - Only Notification Center or Windows Toasters
module.exports = {
  notif: ( title, message ) => {
    if ( !global.config.notifications )
      return;

    notifier.notify( {
      title: title,
      message: message + progInfo,
      sound: true,
      wait: true
    } );
  }
};
