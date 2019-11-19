/*
 * Copyright (c) 2018-2019 João Pedro Martins Neves - All Rights Reserved.
 *
 * MergerJS (merger-js) is licensed under the MIT license, located in
 * the root of this project, under the name "LICENSE.md".
 *
 */

const ____Jasmine = require( 'jasmine' );
const jasmine = new ____Jasmine();

jasmine.loadConfigFile( './tests/jasmine.json' );
jasmine.execute();
