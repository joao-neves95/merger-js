# MergerJS

[![npm](https://img.shields.io/npm/v/merger-js.svg)](https://www.npmjs.com/package/merger-js)
[![LICENSE](https://img.shields.io/npm/l/merger-js.svg)](https://github.com/joao-neves95/merger-js/blob/master/LICENSE.md)\
[![GitHub stars](https://img.shields.io/github/stars/joao-neves95/merger-js.svg?label=star&style=social)](https://github.com/joao-neves95/merger-js)

 Yet another simple cross-platform CLI build tool to bundle JavaScript files, with a custom file import syntax, ES8+ minification, auto build capabilities, and native OS notifications.

 Because merger uses a modified version of uglify-es for minification, you don't need to use any kind of transpilers in order to use this tool. You can use ES8+.

 **MergerJS *is not* a module bundler, is a file bundler.**

 **NPM:** [LINK](https://www.npmjs.com/package/merger-js)\
 **GitHub:** [LINK](https://github.com/joao-neves95/merger-js)\
 **License:** [GPLv3](https://github.com/joao-neves95/merger-js/blob/master/LICENSE.md)\
 **Changelog:** [LINK](https://github.com/joao-neves95/merger-js/blob/master/CHANGELOG.md)\
 **Dependencies:**\
 ├── [uglify-es](https://www.npmjs.com/package/uglify-es)\
 ├── [chokidar](https://github.com/paulmillr/chokidar)\
 ├── [commander](https://github.com/tj/commander.js)\
 ├── [inquirer](https://github.com/SBoudrias/Inquirer.js)\
 ├── [node-notifier](https://github.com/mikaelbr/node-notifier)\
 ├── [chalk](https://github.com/chalk/chalk)\
 ├── [line-by-line](https://github.com/Osterjour/line-by-line)\
 ├── [is-text-path](https://github.com/sindresorhus/is-text-path)\
 ├── [js.system.collections](https://github.com/joao-neves95/js.system.collections)

---

I do not have more free time to work on this project.\
Consider supporting, to advance development.\

├─ USDT (ERC20): 0x789ae7e83a7329910bd947ca70ec254437c10860\
├─ USDC (ERC20): 0x789ae7e83a7329910bd947ca70ec254437c10860\
├─ BTC: 18mDxW4W9YNkf1oYUBpRg6bJDrAmMTrckH\
├─ BTC(SegWit): bc1qdmzpvnvr8defhkx0qx0v9lr95ltywps6e93dt4\
├─ ETH (ERC20): 0x789ae7e83a7329910bd947ca70ec254437c10860\
├─ XMR: 836RoXgkfaXNezcEBUFkUXbdQccHuVCnYc35dyPAYLdxBcgaEnUVyNG7wAR7stTLCfexn2iNFDD1G1wpniNdGZME8TbR6wC

---

&nbsp;

## Features

- [x] **Command Line Interface (CLI)**
- [x] **Merge multiple JS files into one**
- [x] **Support for multiple source/header files**
- [x] **Use @import comments on a source file to specify the build order**
- [x] **Minification, supporting ES6+** (optional)
- [x] **Auto builds on file changes** (optional)
- [x] **Native OS build notifications** (optional)
- [x] **Import an entire directory** (use ```@import<<DIR 'directoryName/'```)
- [x] **Import a file or directory from the node_modules folder** (use ```$import 'file-name'```)
- [x] **Import a file from an URL** (use ```%import 'url'```)
- [x] **Import a file or directory from a GitHub repository** (use ```%import<<github::{branch-name} '{userName}/{repositoryName}/{pathToFile}.js'```)
- [ ] **Create UMD modules**

&nbsp;

## Getting Started

For the latest version of the README, always refer to the MergerJS GitHub repository's master branch:\
https://github.com/joao-neves95/merger-js/blob/master/README.md

### 1) Node.js

You will need [Node.js](https://nodejs.org/en/) version 12+ installed to run merger.

### 2) Install merger with NPM

Install globally ```-g``` with NPM:

```
npm i merger-js -g
```
or


```
npm install merger-js -g
```

&nbsp;

## Use

1) Make a header file - the source file; the first file to be merged - containing, on the top,
   comments importing the files in the order you want them to be built, from the first to the
   last just like in a browser.\

   Example:
   ```
   // $import 'sweetalert2/dist/sweetalert2.all.min.js'
   // %import 'https://code.jquery.com/jquery-3.4.1.min.js'
   // %<<github::v4-dev '/twbs/bootstrap/dist/js/bootstrap.min.js'
   // @'externalLibs'
   // @import<<dir '/enums/'
   // @import 'utilities'
   // @import 'someModel'
   // @import 'someView'
   // @import 'someController'
   // @import 'someOtherModel'
   // @import 'someOtherView'
   // @import 'someOtherController'
   // @import 'someOtherFeature'
   ```
   - Learn more about the import syntax below in the "Import Syntax" section.
   - Instead of ```// @import 'fileName'```, you can just ```// @'fileName'``` or ```$'file-name'```;
   - The extension names ```.js``` are optional;
   - The import of the header file (source file) is optional;
   - You can import files from different directories relative to the same source file.\
     Example: ```// @import '../otherFolder/someFile'```

2) Run ```merger init``` on the root of your project:\
   This will set up the configuration model as well as some global configurations (minification, auto builds on file changes,
   native OS notifications).\
   You can alter them later through the CLI with the "merger set" command (learn more below in the "Commands" section).

3) Run ```merger add``` to add a new source file (header file) to your merger configuration file (learn more below in the "Commands" section).

4) Run ```merger``` or ```merger build``` to start building (learn more below in the "Commands" section).

&nbsp;

## Import Syntax

- ```// @import 'relativePathToTheFile'``` or ```// @'relativePathToTheFile'```:\
   Using an ```@``` token on an import statement imports a file relative to the header file.\

  * Pushing (```<<```) ```dir```, ```DIR```, ```directory``` or ```DIRECTORY``` into ```@import```, imports an entire directory.\
    Note that using this method, the files are not compiled in any specific order.\
    E.g.: ``` // @import<<dir '../otherDirectory/'``` ```// @<<DIR 'someDirectoryHere/'```

- ```// $import 'pathRelativeToNodeModules'``` or ```// $'node_modules_file'```:\
   Using a ```$``` token imports relative to the "node_modules" directory.

  * Pushing (```<<```) ```dir```, ```DIR```, ```directory``` or ```DIRECTORY``` into ```$import```, imports an entire directory from node_modules.\
    Note that using this method, the files are not compiled in any specific order.\
    E.g.: ``` // $import<<dir '../otherDirectory/'``` ```// $<<DIR 'someDirectoryHere/'```

- ```// %import 'https://specificUrl.com/file.min.js'``` or ```// %'https://specificUrl.com/file.min.js'```:\
  Using a ```%``` token imports a file from a specific URL. The file is downloaded and stored in node_modules in the first time and later fetch from there in order to not download the file in each build.\

  * Adding a double ```%%``` token forces the download on every build (good for updates). Valid for specific URLs and GitHub.\
    E.g.: `// %%'https://code.jquery.com/jquery-3.4.1.min.js'`\

  * Pushing (`<<`) `GH`, `gh`, `github` or `GITHUB` into `%import`, imports a file from a GitHub repository.\
  If the branch name is not provided, it is defaulted to the "master" branch.\
    E.g.:<br>
    `// %import<<GH::{branch} '{user}/{repository}/{pathToFile}.js'`\
    `// %<<github::v4-dev '/twbs/bootstrap/dist/js/bootstrap.min.js'`

    * You can specify the branch using the `::` token.

    * MergerJS still supports the previous GitHub import syntax for files, where the branch is specified directly on the path, to avoid breaking changes (not supported on directories). This syntax should be considered as deprecated.\
      E.g.: `// %<<github '/twbs/bootstrap/v4-dev/dist/js/bootstrap.min.js'`

    * Pushing (`<<`) `dir`, `DIR`, `directory` or `DIRECTORY` into `%import<<github`, imports an entire directory from GitHub.\
      Note that using this method, the files are not compiled in any specific order.\
      E.g.: `// %%import<<GH::master<<dir 'twbs/bootstrap/dist/js'`

&nbsp;

<!--
## UMD Module Syntax

### Namespace

- ` // #module::UMD ` \
  - Add this to an header file to tell MergerJS that you want to create a UMD module namespace and later add inner files bundled into it as modules.
  - The namespace will be called the same as your build file name.
  - Keep in mind that compiling an header file into an UMD module will take more time than simply bundling multiple files together,
    because every file will have to be parsed.

### Modules

- ` // #export ` or ` // #export 'myCustomModuleName' ` \
  - MergerJS will default the module name to the name of the file.
  - Optionally, you can add a custom name to your export, to override the module name of the class inside a file.
  - **Every file (module) must be comprised of a <u>single</u> class, object or function.**
  MergerJS will automatically export the first one it sees.
- ` // #require 'myCustomModuleName' `
  - This is what you'll need to use in order to require another module on your namespace.
  - You'll need to use the file name, or custom module name, of the module you require.

&nbsp;
-->

## Commands

- ```merger init```: Configure merger. It creates a merger-config.json file on your working directory.

- ```merger log```: Print the configuration file contents.

- ```merger add```: Add a new source file to the merger config file.\
  You should run this command on the directory where the source file you want to add is located.\
  MergerJS will give you the directory path, you input the source file name (the extension names are
  optional), or a relative path to that directory, and MergerJS will locate the configuration file in
  the hierarchy before the one you are located and update it.

- ```merger rm```: \
  Remove a source file from the merger-config file.\
  You can run this command anywhere within your project (after the configuration file).
  MergerJS will give you all your files within your configuration file and you remove one just by selecting it.

- ```merger``` or ```merger build```: \
  Execute the build with the configuration you gave it on the merger-config.json file.<br>
  You can run it anywhere within your project's folder.
  - ```merger auto```, ```merger build -a``` or ```merger build --auto```: \
    Execute an automatic build session. You can do this, for example, when you have auto builds turned off and
    you don't want to change that.
  <!-- - [NOT FUNCTIONAL] ```merger build -o``` or ```merger build --once```: Perform a one time build session, regardless of the project's configuration file.) -->

- `merger set help` or `merger set list`: <br/>
  List all the configuration keys (it does not list the possible aliases).

- ```merger set <configuration> <value>```: \
  Edit a configuration key on the merger-config file. You can run it anywhere within your project's folder. <br>
  At the moment you can pass:
  - The \<configuration\> ```mnfy```, ```minify``` or ```uglify``` and the \<value\> ```-t``` / ```--true``` or ```-f``` / ```--false``` to set minification to true or false (on/off);
  - The \<configuration\> ```auto``` or ```autobuild``` and the \<value\> ```-t``` / ```--true``` or ```-f``` / ```--false``` to set auto builds to true or false (on/off);
  - The \<configuration\> ```ntfs```, ```notifs```, ```notify```, or ```notifications``` and the \<value\> ```-t``` / ```--true``` or ```-f``` / ```--false``` to set the native OS notifications to true or false (on/off);
  - The \<configuration\> ```updateonlaunch``` or ```updtonlnch``` and the \<value\> ```-t``` / ```--true``` or ```-f``` / ```--false``` to set the update on lauch time to true or false (on/off).
    MergerJS will check for updates once per week. \
  Examples:
    - ```merger set minify -f```
    - ```merger set autobuild --true```
    - ```merger set notifs -t```

- ```merger update```: Update MergerJS. Same as ```npm install merger-js -g```

- ` merger fix-config-paths `: Fixes the paths of the configuration file, in case the location of the project changes (e.g.: different computer).\
  At this moment, this command only works on Windows.

&nbsp;

## Header File Examples

[portfolioOS.header.js](https://github.com/joao-neves95/portfolio-os/blob/master/client/private/js/src/portfolioOS.header.js)

[js.system.collections.header.js](https://github.com/joao-neves95/js.system.collections/blob/master/js.system.collections.header.js)

&nbsp;

## Custom Source File Configuration
Since v3.9.0, it is possible to have custom source file configuration that overwrites the global
configuration.</br>
This is useful, for example, if you have multiple source files and want that only some file be
minified or not.

In the moment, there is no CLI command to edit custom source file configurations, so you will have
to do it by hand. Just add a config object to your source file object.</br>
In the moment there is only the minification (`uglify`) option.

Example (`merger-config.json`):

```json
(...)
"sourceFiles": [
    {
        "source": "path-to\\js.system.collections\\js.system.collections.header.js",
        "output": {
            "path": "path-to\\js.system.collections\\dist",
            "name": "js.system.collections.js"
        }
    },
    {
        "source": "path-to\\js.system.collections\\js.system.collections.header.js",
        "output": {
            "path": "path-to\\js.system.collections\\dist",
            "name": "js.system.collections.min.js"
        },
        "config": {
            "uglify": true
        }
    }
]
(...)

```

&nbsp;

## Versioning

Merger uses [SemVer](https://semver.org/) for versioning. You can read the changelog [here](https://github.com/joao-neves95/merger-js/blob/master/CHANGELOG.md).

&nbsp;

## Code Style

See the style guide here: [merger-js/STYLE-GUIDE.md](https://github.com/joao-neves95/merger-js/blob/master/STYLE-GUIDE.md)

&nbsp;

## Motivation

When I started doing academic web projects,
I felt the need for a build tool to merge all my
JS files into one, cleaning the HTML pages and
optimizing my workflow.
I wanted something simple and fast.
My schoolmates couldn't get around with other
projects like WebPack and similar tools,
so I decided to build MergerJS in order to use
a file bundler in a very simple and fast way.
This is and it always will be a work in progress.
