# CHANGELOG

&nbsp;

#### *V3.2.1 - 19/06/2018

 - Removed the "merger build" command option to build once.

&nbsp;

#### V3.2.0 - 19/06/2018

 - Fixed a bug on the imports parser module where, if parsing a path like "someFile.otherExtentionName", it wouldn't add the extention name ".js", giving an ENOENT error;
 - Added the option ```-o``` or ```--once``` to the ```merger build``` command, to perform a one time build session regardless of the project's merger configuration file;
 - Fixed a bug on the configuration parser module (it was not functioning);
 - Minor performance optimisations (on the for loops). Could be a myth though.

&nbsp;

#### V3.1.0 - 04/06/2018

 - Added the "merger rm" command to remove source files from the configurtion file;
 - Added the "merger log" command to print the configuration file;
 - Refactoring of the editConfigFile module to have less code repetition;
 - Fixed some typos.

&nbsp;

#### V3.0.9 (HotFix) - 31/05/2018

 - Solved a bug when selecting the source file, to build, on the same directory as the merger configuration file.

&nbsp;

#### V3.0.8 (HotFix) - 30/05/2018

 - Quick fix to the source file selection prompt. Now operational.

&nbsp;

#### V3.0.7 - 30/05/2018

 - Added the source file paths, not only the file names, to the source file build selection prompt;
 - Solved a bug where, if the user passed an unknown configuration key to the "merger set" command, the error got thrown but the key was still added to the configuration file;
 - Fixed the checkForUpdates module. Changed the protocol from HTTP to HTTPS. Using the public mirror of npm registry now;
 - Minor fixes and refactorings.

&nbsp;

#### V3.0.6 (HotFix) - 28/05/2018

 - Fixed a bug, where if the call to the npm registry to check updates were not sucessful, it would stop execution.

&nbsp;

#### V3.0.5 (HotFix) - 22/05/2018

 - Removed lost debug log.

&nbsp;

#### V3.0.4 - 22/05/2018

 - Solved a bug where, if the minification build configuration were turned off, it wouldn't merge the file correctly;
 - Some minor dependency security fixes.

&nbsp;

#### V3.0.3 - 07/05/2018

 - Made extension names, on the CLI's add files to the merger-config prompt, optional. If the user is on the file's directory he only needs to input the file name;
 - If there's only one source file on the merger-config, MergerJS will choose that one on build by default, removing the need to choose a file;
 - Added error handling to the CLI's source file selection;
 - Removed some unnecessary logic from v2.

&nbsp;

#### V3.0.2 (No Changes) - 05/05/2018

 - Updated the npm's MergerJS README, explaining the new version 3 usage.

   For the latest version of the README, always refer to the GitHub repository's master branch:<br/>
   https://github.com/joao-neves95/merger-js/blob/master/README.md

&nbsp;

#### V3.0.1 (Hotfix) - 04/05/2018

 - Fixed some modules and packages requires on a merger module.

&nbsp;

#### V3.0.0 - 04/05/2018

 - Added an add source file command to the CLI (Add support for multiple source files);
 - Added the ability for MergerJS to find the merger-config file from within the working directory;
 - Refactored the merger init CLI process;
 - Refactored the merger configuration file model;
 - Refactored the codebase and further modularized it;
 - Added more styling.

&nbsp;

#### V2.2.5 - 28/04/2018

 - Refactored and fixed the timestamps module;
 - Added some styling to the console.

&nbsp;

#### V2.2.4 - 24/04/2018

 - Small fix on the timestamps. They are now localized.

&nbsp;

#### V2.2.3 - 18/04/2018

 - Small bug fix on the merger update command.

&nbsp;

#### V2.2.2 - 18/04/2018

 - Added the notifications configuration to the merger init CLI.

&nbsp;

#### V2.2.1 - 17/04/2018

 - Removed debug log.

&nbsp;

#### V2.2.0 - 17/04/2018

 - Made native OS notifications optional and configurable through the CLI;
 - Improvement and minor fixes/refactorings on the import parser;
 - Other minor improvements/refactorings/bug fixes.

&nbsp;

#### V2.1.0 - 10/04/2018

 - Added the "set" command, to edit the merger configuration file through the CLI (README.md for more info);
 - Minor refactorings and bug fixes.

&nbsp;

#### V2.0.8 (Patch) - 09/04/2018

 - Added .git to .npmignore. The .git folder was beeing installed along with merger-js, which caused errors during updates. The command "merger update", and normal updates by "npm i merger-js -g", are now functional.<br/>
 It is advised to reinstall merger-js:<br/>
 1) "npm rm merger-js -g"<br/>
 2) "npm i merger-js -g"
 
&nbsp;

#### V2.0.5/6/7 (Hotfixes) - 09/04/2018

 - Sent the wrong files to npm multiple times and had one error in package.json.<br/>
   No changes.

&nbsp;

#### V2.0.4 - 09/04/2018

 - Added data from last version (2.0.3) to GitHub (not pushed to GitHub);
 - Removed ability to set OS native notifications off. It introduced a bug. Removed the feature until further development;
 - Made updates optional;
 - Added the command "merger update".

&nbsp;

#### V2.0.3 - 07/04/2018

 - **BUG:** Solved a bug where the inputs were only beeing parsed on the first build instead of on each build. If a user reorganized their imports, it wouldn't affect the build. Bug solved.
 - Added an HTTP request to the npm-registry when the user runs merger, in order to check if there's a new version available;
 - Made OS native notifications optional.

#### V2.0.2 - 05/04/2018

 - Quick fix to a bug inserted on the last patch;
 - Solved minor package security vulnerabilities (snyk).

&nbsp;

#### V2.0.1 - 05/04/2018

 - The imports on the source file are now parsed at build time. This enables adding/removing/reorganizing build files by simply just adding/removing/reorganizing @import comments;
 - Improved the imports parser;
 - Tested imports from diferent directories;
 - Minor code fixes and refactorings.

&nbsp;

#### V2.0.0 - 04/04/2018

 - **New usage:** Instead of imputing all files by hand, the build order is now imported in a source script;
 - Added notifications for inits;
 - Minor code fixes;
 - Updated the DOCS (README.md) for the new usage.

&nbsp;

#### V1.1.0 - 04/04/2018

 - Added native OS notifications (node-notifier);
 - Migrated from async to neo-async;
 - Refactored the timestamps on the build notifications (CLI);
 - Added the merger's GitHub repository and NPM links to the merger-config file;
 - Minor fixes/refactorings.

&nbsp;

#### V1.0.6 - 04/04/2018

 - Fixed some dependency vulnerabilities;
 - Deleted some unneeded files;
 - Updated package.json;
 - Updated TODO.md.

&nbsp;

#### V1.0.5 - 03/04/2018

 - Fixed a bug on minification. The data from all files was beeing minified at the same time, leading to poor and indecipherable error reporting;
 - Some style fixes to the CLI's infos/warnings.

&nbsp;

#### V1.0.4 - 03/04/2018

 - Fixed a bug with the minifier. It wasn't beeing activated;
 - Added a timestamp after every build;
 - Added "Ready to build. Listening for file changes..." after every build (if autoBuild is on).

&nbsp;

#### V1.0.3 - 03/04/2018

 - Fixed a bug on the CLI's fileOrder question.

&nbsp;

#### V1.0.2 - 03/04/2018

 - Added documentation;
 - Updated the package.json.

&nbsp;

#### V1.0.1 - 02/04/2018

 - Added documentation;
 - Update package.json.

&nbsp;

#### V1.0.0 - 02/04/2018

- Upgraded to version 1.0.0;
- Added a smart CLI functionality;
- Modularized the source code;
- Major refactoring and fixes;
- Added a sample folder for testing;
- Added a TODO list.

&nbsp;

#### V0.2.0 - 02/04/2018

- Added the ability for auto build on file changes (optional);
- Some minor fixes;
- Added console messages;
- Refactored the code.

&nbsp;

#### V0.1.0 - 02/04/2018
The creation.
