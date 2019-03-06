/*
 * Copyright (c) 2018-2019 João Pedro Martins Neves - All Rights Reserved.
 *
 * MergerJS (merger-js) is licensed under the MIT license, located in
 * the root of this project, under the name "LICENSE.md".
 *
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
