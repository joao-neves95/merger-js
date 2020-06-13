# CHANGELOG

&nbsp;

#### *v3.10.3 - 13/06/2020

  - Performance improvements.
  - Big internal refactorings in preparation for the upcoming UMD module creation.

&nbsp;

#### v3.10.2 - 11/06/2020

  - Fixed the `merger set` command, which was due to a bug added with the help command.

&nbsp;

#### v3.10.1 - 05/06/2020

  - Fixed a typo on the fileDownloader module that caused the
    program to crash in case the user had the updates enabled.
  - Updated the CLI package Commander from 3.0.2 to 5.1.0.

&nbsp;

#### v3.10.0 - 18/05/2020

  - Added the `merger set --list` command, to list all the possible
    full configuration keys (no aliases).
  - Internal improvements and refactorings.
  - Updated dependencies (MINORs and PATCHs).

&nbsp;

#### v3.9.5 - 31/03/2020

  - Added the "fix-config-paths" command, for use in case the location of the project changes
    (E.g.: different computer).
  - Updated dependencies.
  - Internal improvements.

&nbsp;

#### Hotfix v3.9.1 to v3.9.4 - 20/11/2019

  - Fixes on the `merger init` command.
  - Fix on the `merger rm` command. In case there was only one file, the program crashed.

&nbsp;

#### v3.9.0 - 19/11/2019

  - Added support for optional custom source file configuration that overwrites the global merger configuration
    (minfication for the moment).

  - Fixed a bug on the imports parser, where the file extension had always to be `.js`.<br>
    Now, it only defaults to `.js` in case there was no extension provided (like it is
    stated on the docs: [README.md](https://github.com/joao-neves95/merger-js/blob/master/README.md#use)).<br>
    With this fix, MergerJS can now merge any text files, for example HTML files.

  - Fixed a bug on the `merger rm` command, where it was only possible to remove one file
    and the program crashed if the user selected the "All" option on the source file selection.

  - Fixed a bug on the `merger add` command, where if the user deleted its build file name input,
    the name was set to ".js".

  - Fixed a bug on the file path console output of the `merger build` command.<br/>
    Example of the previous output: "path-to\js.system.collections\js.system.collections\distjs.system.collections.js"
    Example of the fixed output: "path-to\js.system.collections\js.system.collections\dist\js.system.collections.js"

  - Significant performance improvements.

  - Big internal refactorings: Slowly migrating to the Node.js sync API and removed a lot of the "callback hell".

  - Updated dependencies.

&nbsp;

#### v3.8.5 - 21/10/2019

  - Refactored the import parser and made multiple optimisations.
  - Updated dependencies.
  - Added more testing.

&nbsp;

#### v3.8.4 - 07/10/2019

  - The output of `merger update` is now printed on the console.

&nbsp;

#### v3.8.3 - 06/10/2019

  - Fixed dependency vulnerability issues.
  - Updated dependencies.

&nbsp;

#### v3.8.2 - 07/06/2019

  - Added tests (finally!);
  - fileDownloader module:
    - Fixed an issue when the user added a '/' in the end of a GitHub path;
    - Improved the fileDownloader error messages and handling.
  - Fixed and improved the import syntax token removers regex functions;
  - Cross platform fixes;
  - Other multiple minor internal fixes/refactorings/improvements.

&nbsp;

#### v3.8.1 - 19/05/2019

  - Added the first set of tests (parseImports and minifyCode).

&nbsp;

#### v3.8.0 - 10/05/2019

  - Added support for importing an entire directory from GitHub.<br/>
    There is a new import syntax for GitHub now.
    The previous one is still supported to avoid breaking changes, but should be considered as deprecated.<br/>
    New syntax: `// %%import<<GH::master<<dir 'twbs/bootstrap/dist/js'`<br/>
    (Read the README.md for more information).
  - Multiple big internal refactorings.
  - Other minor fixes.

&nbsp;

#### v3.7.1 - 04/05/2019

 - Fixed a bug when importing from directories. It was importing relative to the header file instead of the directory of the
   header file, like it used to (bug from last update).

&nbsp;

#### v3.7.0 - 17/04/2019

 - Added a drop down in the "merger add" CLI command with all the files in that directory and an option to input a custom one;
 - Added support for importing an entire directory of .js files inside node_modules;
 - Added support for forced imports (downloads) from external URLs;
 - Other fixes/improvements.

&nbsp;

#### v3.6.9 - 16/04/2019

 - Merger init configuration customization is now optional;
 - Added the new configuration properties to the config model and to the CLI's init module;
 - Fixed theNewTimestamp module. It is now a "static" class. There was a bug because of self object properties reference;
 - Other minor fixes and refactorings;
 - Updated dependencies.

&nbsp;

#### v3.6.8 - 07/03/2019

 - MergerJS will now update only once per week;
 - Multiple dependency updates;
 - Multiple security fixes;
 - Other minor improvements/fixes/refactorings.

&nbsp;

#### v3.6.7 - 05/03/2019

 - The update on launch time is now optional. Read more in... README.md;
 - Some silent bugs fixes with error handling/catching on the checkForUpdates, updateMerger, editConfigFile.addProperty and editConfigFile.addFileToConfig;
 - Optimizations to the config module;
 - Added the Collections module (will do a separate NPM package in the future).

&nbsp;

#### v3.6.6 - 12/11/2018

 - Solved a bug, introduced int the last patch by the license headers, that somehow made the shebang not work.

&nbsp;

#### v3.6.5 - 11/11/2018

 - Solved a bug where it was added an "\ufeff" unicode character as first char of each file contents on the build process (char encoding Node.js issue).

&nbsp;

#### v3.6.4 - 08/11/2018

 - Small bug fix on the ParseImports module (in the try/catch of the read from directory). There was a typo on the catch exception variable, that, for example, if the user made some error on the imported directory name, it caused MergerJS to crash without notifying the user;
 - Other minor small fixes.

&nbsp;

#### v3.6.3 - 01/11/2018

 - Multiple package updates.

&nbsp;

#### v3.6.2 - 26/10/2018

 - Solved a bug where, in non-minified builds, if the last line of a file ended with a comment it commented out the first line of the next file;
 - Solved bug where if the user imported an entire directory (e.g.: ```@import<<DIR 'someDir'```) with subdirectories, it gave an "EISDIR" read error;

&nbsp;

#### v3.6.1 - 05/10/2018

 - Fixed error on the importsParser.js module introduced on the last version.

&nbsp;

#### v3.6.0 - 04/10/2018

 - **Added support for importing entire directories. Using this methods, the files are not compiled in any specific order**;
 - Fixed a bug introduced in v3.5.0 (commit: https://github.com/joao-neves95/merger-js/commit/a976bd6bf1ea317f344bcead2d991532a2db9684#diff-e8f6b017cf5303324df391ba7f9e0b07), in the auto build 'change' event async Callback (called multiple times);
 - Fixed a bug in the github imports. Starting the path of the github repository with a bar broke the fileDownloader.js ('/twbs/bootstrap/v4-dev/dist/js/bootstrap.min.js' vs. 'twbs/bootstrap/v4-dev/dist/js/bootstrap.min.js');
 - Minor optimization and fixes on the parseImports.js module.

&nbsp;

#### v3.5.0 - 03/10/2018

 - Major update to the parseImports.js module:
   * **Added support for making file imports from an URL and GitHub repositories (read more in README.md)**;
   * Migration from the terrible standard readline module, that doesn't support asynchrony, to the "line-by-line" package (link in READEME.md);
   * Major code refactoring for less repetition.
 - Solved a bug where if the user choosed to build "All" files (on the source file selection prompt), the timer got compromised and gave an error (asynchrony bug);
 - General code refatorings and reorganization, as well as multiple fixes;
 - Code of Conduct update.

&nbsp;

#### v3.4.1 - 25/09/2018

 - Minor optimization to the program initialization user config parser: "node_modules" folder path is now saved on the merger-config.json when necessary, instead of searched in each build;
 - Refactorings (various structural changes/reorganization).

&nbsp;

#### v3.4.0 - 18/09/2018

 - Added the ability to merge files from packages located in "node_modules".
 - Fixes and refactorings.

&nbsp;

#### v3.3.0 - 09/08/2018

 - Added the "All" option to the select source file prompt (when there is multiple files) to build all source files (header files) present on the merger configuration;
 - Minor refactorings.

&nbsp;

#### v3.2.1 - 19/06/2018

 - Removed the "merger build" command option to build once.

&nbsp;

#### v3.2.0 - 19/06/2018

 - Fixed a bug on the imports parser module where, if parsing a path like "someFile.otherExtentionName", it wouldn't add the extention name ".js", giving an ENOENT error;
 - Added the option ```-o``` or ```--once``` to the ```merger build``` command, to perform a one time build session regardless of the project's merger configuration file;
 - Fixed a bug on the configuration parser module (it was not functioning);
 - Minor performance optimisations (on the for loops). Could be a myth though.

&nbsp;

#### v3.1.0 - 04/06/2018

 - Added the "merger rm" command to remove source files from the configurtion file;
 - Added the "merger log" command to print the configuration file;
 - Refactoring of the editConfigFile module to have less code repetition;
 - Fixed some typos.

&nbsp;

#### v3.0.9 (HotFix) - 31/05/2018

 - Solved a bug when selecting the source file, to build, on the same directory as the merger configuration file.

&nbsp;

#### v3.0.8 (HotFix) - 30/05/2018

 - Quick fix to the source file selection prompt. Now operational.

&nbsp;

#### v3.0.7 - 30/05/2018

 - Added the source file paths, not only the file names, to the source file build selection prompt;
 - Solved a bug where, if the user passed an unknown configuration key to the "merger set" command, the error got thrown but the key was still added to the configuration file;
 - Fixed the checkForUpdates module. Changed the protocol from HTTP to HTTPS. Using the public mirror of npm registry now;
 - Minor fixes and refactorings.

&nbsp;

#### v3.0.6 (HotFix) - 28/05/2018

 - Fixed a bug, where if the call to the npm registry to check updates were not sucessful, it would stop execution.

&nbsp;

#### v3.0.5 (HotFix) - 22/05/2018

 - Removed lost debug log.

&nbsp;

#### v3.0.4 - 22/05/2018

 - Solved a bug where, if the minification build configuration were turned off, it wouldn't merge the file correctly;
 - Some minor dependency security fixes.

&nbsp;

#### v3.0.3 - 07/05/2018

 - Made extension names, on the CLI's add files to the merger-config prompt, optional. If the user is on the file's directory he only needs to input the file name;
 - If there's only one source file on the merger-config, MergerJS will choose that one on build by default, removing the need to choose a file;
 - Added error handling to the CLI's source file selection;
 - Removed some unnecessary logic from v2.

&nbsp;

#### v3.0.2 (No Changes) - 05/05/2018

 - Updated the npm's MergerJS README, explaining the new version 3 usage.

   For the latest version of the README, always refer to the GitHub repository's master branch:<br/>
   https://github.com/joao-neves95/merger-js/blob/master/README.md

&nbsp;

#### v3.0.1 (Hotfix) - 04/05/2018

 - Fixed some modules and packages requires on a merger module.

&nbsp;

#### v3.0.0 - 04/05/2018

 - Added an add source file command to the CLI (Add support for multiple source files);
 - Added the ability for MergerJS to find the merger-config file from within the working directory;
 - Refactored the merger init CLI process;
 - Refactored the merger configuration file model;
 - Refactored the codebase and further modularized it;
 - Added more styling.

&nbsp;

#### v2.2.5 - 28/04/2018

 - Refactored and fixed the timestamps module;
 - Added some styling to the console.

&nbsp;

#### v2.2.4 - 24/04/2018

 - Small fix on the timestamps. They are now localized.

&nbsp;

#### v2.2.3 - 18/04/2018

 - Small bug fix on the merger update command.

&nbsp;

#### v2.2.2 - 18/04/2018

 - Added the notifications configuration to the merger init CLI.

&nbsp;

#### v2.2.1 - 17/04/2018

 - Removed debug log.

&nbsp;

#### v2.2.0 - 17/04/2018

 - Made native OS notifications optional and configurable through the CLI;
 - Improvement and minor fixes/refactorings on the import parser;
 - Other minor improvements/refactorings/bug fixes.

&nbsp;

#### v2.1.0 - 10/04/2018

 - Added the "set" command, to edit the merger configuration file through the CLI (README.md for more info);
 - Minor refactorings and bug fixes.

&nbsp;

#### v2.0.8 (Patch) - 09/04/2018

 - Added .git to .npmignore. The .git folder was beeing installed along with merger-js, which caused errors during updates. The command "merger update", and normal updates by "npm i merger-js -g", are now functional.<br/>
 It is advised to reinstall merger-js:<br/>
 1) "npm rm merger-js -g"<br/>
 2) "npm i merger-js -g"

&nbsp;

#### v2.0.5/6/7 (Hotfixes) - 09/04/2018

 - Sent the wrong files to npm multiple times and had one error in package.json.<br/>
   No changes.

&nbsp;

#### v2.0.4 - 09/04/2018

 - Added data from last version (2.0.3) to GitHub (not pushed to GitHub);
 - Removed ability to set OS native notifications off. It introduced a bug. Removed the feature until further development;
 - Made updates optional;
 - Added the command "merger update".

&nbsp;

#### v2.0.3 - 07/04/2018

 - **BUG:** Solved a bug where the inputs were only beeing parsed on the first build instead of on each build. If a user reorganized their imports, it wouldn't affect the build. Bug solved.
 - Added an HTTP request to the npm-registry when the user runs merger, in order to check if there's a new version available;
 - Made OS native notifications optional.

#### v2.0.2 - 05/04/2018

 - Quick fix to a bug inserted on the last patch;
 - Solved minor package security vulnerabilities (snyk).

&nbsp;

#### v2.0.1 - 05/04/2018

 - The imports on the source file are now parsed at build time. This enables adding/removing/reorganizing build files by simply just adding/removing/reorganizing @import comments;
 - Improved the imports parser;
 - Tested imports from diferent directories;
 - Minor code fixes and refactorings.

&nbsp;

#### v2.0.0 - 04/04/2018

 - **New usage:** Instead of imputing all files by hand, the build order is now imported in a source script;
 - Added notifications for inits;
 - Minor code fixes;
 - Updated the DOCS (README.md) for the new usage.

&nbsp;

#### v1.1.0 - 04/04/2018

 - Added native OS notifications (node-notifier);
 - Migrated from async to neo-async;
 - Refactored the timestamps on the build notifications (CLI);
 - Added the merger's GitHub repository and NPM links to the merger-config file;
 - Minor fixes/refactorings.

&nbsp;

#### v1.0.6 - 04/04/2018

 - Fixed some dependency vulnerabilities;
 - Deleted some unneeded files;
 - Updated package.json;
 - Updated TODO.md.

&nbsp;

#### v1.0.5 - 03/04/2018

 - Fixed a bug on minification. The data from all files was beeing minified at the same time, leading to poor and indecipherable error reporting;
 - Some style fixes to the CLI's infos/warnings.

&nbsp;

#### v1.0.4 - 03/04/2018

 - Fixed a bug with the minifier. It wasn't beeing activated;
 - Added a timestamp after every build;
 - Added "Ready to build. Listening for file changes..." after every build (if autoBuild is on).

&nbsp;

#### v1.0.3 - 03/04/2018

 - Fixed a bug on the CLI's fileOrder question.

&nbsp;

#### v1.0.2 - 03/04/2018

 - Added documentation;
 - Updated the package.json.

&nbsp;

#### v1.0.1 - 02/04/2018

 - Added documentation;
 - Update package.json.

&nbsp;

#### v1.0.0 - 02/04/2018

- Upgraded to version 1.0.0;
- Added a smart CLI functionality;
- Modularized the source code;
- Major refactoring and fixes;
- Added a sample folder for testing;
- Added a TODO list.

&nbsp;

#### v0.2.0 - 02/04/2018

- Added the ability for auto build on file changes (optional);
- Some minor fixes;
- Added console messages;
- Refactored the code.

&nbsp;

#### v0.1.0 - 02/04/2018
The creation.
