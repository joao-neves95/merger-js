/*
 * Copyright (c) 2018-2020 João Pedro Martins Neves - All Rights Reserved.
 *
 * MergerJS (merger-js) is licensed under the
 * GPLv3.0 license (GNU General Public License v3.0),
 * located in the root of this project, under the name "LICENSE.md".
 */

const ____Jasmine = require( 'jasmine' );
const jasmine = new ____Jasmine();

jasmine.loadConfigFile( './tests/jasmine.json' );
jasmine.execute();
