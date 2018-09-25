'use strict'
const prompt = require('../../node_modules/inquirer').createPromptModule();
const UserConfig = require('../../models/userConfigModel');
const writeConfigFile = require('../utils').writeJSONFile;
const newTimestamp = require('../newTimestamp').small;
const finalInitMessage = 'Run "merger" or "merger build" to start building.';

// TODO: Add validation.
const questions = [
  {
    type: 'list',
    name: 'uglify',
    message: '\n Minify the JS output build file? ',
    choices: ['Yes', 'No'],
    default: 'Yes'
  },
  {
    type: 'list',
    name: 'auto',
    message: '\n Enable auto builds? ',
    choices: ['Yes', 'No'],
    default: 'No'
  },
  {
    type: 'list',
    name: 'notifs',
    message: '\n Enable native OS notifications? ',
    choices: ['Yes', 'No'],
    default: 'Yes'
  }
];

module.exports = () => {
  prompt( [questions[0], questions[1], questions[2]] ).then( ( answers ) => {
    let config = {};
    // Minification:
    if ( answers.uglify === 'No' )
      config.uglify = false;
    else
      config.uglify = true;
    // Auto builds:
    if ( answers.auto === 'Yes' )
      config.autoBuild = true;
    else
      config.autoBuild = false;
    // Notifications:
    if ( answers.notifs === 'Yes' )
      config.notifications = true;
    else
      config.notifications = false;

    const userConfig = new UserConfig( config.uglify, config.autoBuild, config.notifications );

    writeConfigFile( process.cwd(), 'merger-config', userConfig, ( err, data ) => {
      if ( err )
        return console.error( err );
      else {
        let timestamp = newTimestamp();
        console.info( `\n ${timestamp} - Init successful.\n`, data, `\n ${finalInitMessage}` );
      }
    } );
  } );
};
