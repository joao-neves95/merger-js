﻿/*
 * Copyright (c) 2018-2020 João Pedro Martins Neves - All Rights Reserved.
 *
 * MergerJS (merger-js) is licensed under the
 * GPLv3.0 license (GNU General Public License v3.0),
 * located in the root of this project, under the name "LICENSE.md".
 */

'use strict';
const prompt = require('../../node_modules/inquirer').createPromptModule();
const { writeJSONFile } = require( '../utils' );
const getNodeModulesPath = require( '../configFileAccess' ).getNodeModulesPath;
const newTimestamp = require( '../newTimestamp' ).small;
const UserConfig = require('../../models/userConfigModel');
const promptResonseType = require( '../../enums/promptResponseType' );
const finalInitMessage = 'Run "merger" or "merger build" to start building.';

const initQuestions = [
  {
    type: 'list',
    name: 'customize',
    message: '\n Do you want to customize the configuration file? ',
    choices: [promptResonseType.Afirmative, promptResonseType.Negative],
    default: promptResonseType.Afirmative
  }
];

// TODO: Add validation.
const customizationQuestions = [
  {
    type: 'list',
    name: 'uglify',
    message: '\n Minify the JS output build file? ',
    choices: [promptResonseType.Afirmative, promptResonseType.Negative],
    default: promptResonseType.Afirmative
  },
  {
    type: 'list',
    name: 'auto',
    message: '\n Enable auto builds? ',
    choices: [promptResonseType.Afirmative, promptResonseType.Negative],
    default: promptResonseType.Negative
  },
  {
    type: 'list',
    name: 'notifs',
    message: '\n Enable native OS notifications? ',
    choices: [promptResonseType.Afirmative, promptResonseType.Negative],
    default: promptResonseType.Afirmative
  }
];

/**
 * 
 * @param { UserConfig } config UserConfig model.
 */
const __customizationPrompt = ( config ) => {
  return new Promise( ( _res, _rej ) => {

    prompt( [customizationQuestions[0], customizationQuestions[1], customizationQuestions[2]] ).then( async ( answers ) => {
      // Minification:
      if ( answers.uglify === promptResonseType.Negative )
        config.uglify = false;
      else
        config.uglify = true;
      // Auto builds:
      if ( answers.auto === promptResonseType.Afirmative )
        config.autoBuild = true;
      else
        config.autoBuild = false;
      // Notifications:
      if ( answers.notifs === promptResonseType.Afirmative )
        config.notifications = true;
      else
        config.notifications = false;

      return _res();
    } );

  } );
};

module.exports = () => {
  let config = new UserConfig();

  prompt( [initQuestions[0]] ).then( async answers => {

    if ( answers.customize === promptResonseType.Afirmative )
      await __customizationPrompt( config );

    try {
      const nodeModulesFilePath = getNodeModulesPath();
      if ( nodeModulesFilePath !== false ) {
        config.nodeModulesPath = nodeModulesFilePath;
      }

    } catch ( e ) {
      // continue;
    }

    try {
      writeJSONFile( process.cwd(), 'merger-config', config );
      console.info( `\n ${newTimestamp()} - Init successful.\n`, JSON.stringify( config, null, '\t' ), `\n ${finalInitMessage}` );

    } catch ( e ) {
      console.error( 'ERROR:', e );
    }

  } );

};

