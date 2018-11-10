# MergerJS

[![npm](https://img.shields.io/npm/v/merger-js.svg)](https://www.npmjs.com/package/merger-js)
[![LICENSE](https://img.shields.io/npm/l/merger-js.svg)](https://github.com/joao-neves95/merger-js/blob/master/LICENSE)
[![DepShield Badge](https://depshield.sonatype.org/badges/joao-neves95/merger-js/depshield.svg)](https://depshield.github.io)

 Yet another lightweight and simple cross-platform CLI build tool for JavaScript files, file imports, auto build capabilities and native OS notifications.
 
 Because merger uses uglify-es for minification, you don't need to use any kind of transpilers in conjunction with this tool. You can use ES6+.
 
 **MergerJS *does not* support circular dependencies**
 
 **NPM:** [LINK](https://www.npmjs.com/package/merger-js)<br/>
 **GitHub:** [LINK](https://github.com/joao-neves95/merger-js)<br/>
 **License:** [MIT](https://github.com/joao-neves95/merger-js/blob/master/LICENSE)<br/>
 **Dependencies:**<br/>
 ├── [uglify-es](https://www.npmjs.com/package/uglify-es)<br/>
 ├── [neo-async](https://github.com/suguru03/neo-async)<br/>
 ├── [chokidar](https://github.com/paulmillr/chokidar)<br/>
 ├── [commander](https://github.com/tj/commander.js)<br/>
 ├── [inquirer](https://github.com/SBoudrias/Inquirer.js)<br/>
 ├── [node-notifier](https://github.com/mikaelbr/node-notifier)<br/>
 ├── [chalk](https://github.com/chalk/chalk)<br/>
 ├── [line-by-line](https://github.com/Osterjour/line-by-line)<br/>

<br/>

 ---

<br/>

## Features
 - [x] **CLI tooling**
 - [x] **Merge multiple JS files into one**
 - [x] **Support for multiple source/build files**
 - [x] **Use @import comments on a source file to specify the build order**
 - [x] **Minification, supporting ES6+** (optional)
 - [x] **Auto builds on files changes** (optional)
 - [x] **Native OS build notifications** (optional)
 - [x] **Import a directory** (use ```@import<<DIR 'directoryName/'```)
 - [x] **Import a file from the node_modules folder** (use ```$import 'file-name'```)
 - [x] **Import a file from an URL** (use ```%import 'url'```)
 
&nbsp;

## Getting Started

For the latest version of the README, always refer to the MergerJS GitHub repository's master branch:<br/>
https://github.com/joao-neves95/merger-js/blob/master/README.md 


### 1) Node.js

You will need [Node.js](https://nodejs.org/en/) version 10+ installed to run merger.

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

## Use:

1) Make an header file (the source file; the first file to be merged) containing, on the top, comments importing the files in the order you want them to be built, from the first to the last.<br/>
   Just like in a browser.
   
   Example:
   ```
   // $import 'sweetalert2/dist/sweetalert2.all.min.js'
   // %import 'https://cdnjs.cloudflare.com/ajax/libs/react/16.4.2/cjs/react.development.js'
   // %<<github '/twbs/bootstrap/v4-dev/dist/js/bootstrap.min.js'
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
   - You can import files from different directories relative to the same source file.<br/>
     Example: ```// @import '../otherFolder/someFile'```

&nbsp;

2) Run ```merger init``` on the root of your project:<br/>
  This will set up the configuration model as well as some global configurations (minification, auto builds on file changes, native OS notifications).<br/>
  You can alter them later through the CLI with the "merger set" command (learn more below in the "Commands" section).

&nbsp;

3) Run ```merger add``` to add a new source file (header file) to your merger configuration file (learn more below in the "Commands" section).

4) Run ```merger``` or ```merger build``` to start building (learn more below in the "Commands" section).

&nbsp;

## Import Syntax:

- ```// @import 'relativePathToTheFile'``` or ```// @'relativePathToTheFile'```:<br/>
   Using an ```@``` token on an import statement imports a file relative to the header file.<br/>

  * Pushing (```<<```) ```dir```, ```DIR```, ```directory``` or ```DIRECTORY``` into ```@import```, imports an entire directory. Using this method, the files are not compiled in any specific order.<br/>
    E.g.: ``` // @import<<dir '../otherDirectory/'``` ```// @<<DIR 'someDirectoryHere/'```

- ```// $import 'pathRelativeToNodeModules'``` or ```// $'node_modules_file'```:<br/>
   Using a ```$``` token imports relative to the "node_modules" directory.

- ```// %import 'https://specificUrl.com/file.min.js'``` or ```// $'https://specificUrl.com/file.min.js'```:<br/>
  Using a ```%``` token imports a file from a specific URL. The file is downloaded and stored in node_modules in the first time and later fetch from there in order to not download the file in each build.<br/>

  * Pushing (```<<```) ```GH```, ```gh```, ```github``` or ```GITHUB``` into ```%import```, imports a file from a GitHub repository.<br/>
  If the branch name is not provided, it defaults to the "master" branch.<br/>
    E.g.: ```// %import<<GH '<userName>/<repositoryName>/<branchName>/<pathToFile>'```<br/>
         ```// $<<github '/twbs/bootstrap/v4-dev/dist/js/bootstrap.min.js'```

&nbsp;

## Commands

- ```merger init```: Configure merger. It creates a merger-config.json file on your working directory.

- ```merger log```: Print the configuration file contents.

- ```merger add```: Add a new source file to the merger config file.<br/>
  You should run this command on the directory where the source file you want to add is located.<br/>
  MergerJS will give you the directory path, you input the source file name (the extension names are optional), or a relative path to that directory, and MergerJS will locate the configuration file and update it.

- ```merger rm```: Remove a source file from the merger-config file.<br/>
  You can run this command anywhere within your project (after the configuration file).
  MergerJS will give you all your files within your configuration file and you remove one just by selecting it.

- ```merger``` or ```merger build```: Execute the build with the configuration you gave it on the merger-config.json file.<br>
  You can run it anywhere within your project's folder.
  - ```merger auto```, ```merger build -a``` or ```merger build --auto```: Execute an automatic build session. You can do this, for example, when you have auto builds turned off and you don't want to change that.
  <!-- - [NOT FUNCTIONAL] ```merger build -o``` or ```merger build --once```: Perform a one time build session, regardless of the project's configuration file.) -->

- ```merger set <configuration> <value>```: Edit a configuration key on the merger-config file.<br/>
  You can run it anywhere within your project's folder.<br>
  At the moment you can pass:
  - The \<configuration\> ```mnfy```, ```minify``` or ```uglify``` and the \<value\> ```-t``` / ```--true``` or ```-f``` / ```--false``` to set minification to true or false (on/off);
  - The \<configuration\> ```auto``` or ```autobuild``` and the \<value\> ```-t``` / ```--true``` or ```-f``` / ```--false``` to set auto builds to true or false (on/off);
  - The \<configuration\> ```ntfs```, ```notifs```, ```notify```, or ```notifications``` and the \<value\> ```-t``` / ```--true``` or ```-f``` / ```--false``` to set the native OS notifications to true or false (on/off);
  
  Examples: ```merger set minify -f```, ```merger set autobuild --true```, ```merger set notifs -t```

- ```merger update```: Update MergerJS. Same as ```npm install merger-js -g```

&nbsp;

## Example of a File Structure

|-- root/</br>

>|-- **merger-config.json**</br>
>|-- package.json</br>
>|-- .env</br>
>|-- node_modules/</br>
>|-- (...)</br>

>|-- server/</br>
>>|-- (...)</br>

>|-- client/</br>

>>|-- css</br>
>>>|-- (...)</br>

>>|-- js</br>
>>>|-- mergerBuildFile.js</br>
>>>|-- src</br>
>>>>|-- sourceFile.header.js (the header file containing all the imports; the first file to be build)</br>
>>>>|-- utilities.js</br>
>>>>|-- someOtherView.js</br>
>>>>|-- someOtherModel.js</br>
>>>>|-- someController.js</br>

&nbsp;

## Known Issues

The auto build does not work properly and all times on Visual Studio. It works very well on Visual Studio Code though.

&nbsp;

## Versioning

Merger uses [SemVer](https://semver.org/) for versioning. You can read the changelog [here](https://github.com/joao-neves95/merger-js/blob/master/CHANGELOG.md).

&nbsp;

## Code Style

**JavaScript Standard Style, *with semicolons*.**

Since version 3.5.0, every asynchronous function supports both callbacks and promises (async/await).

&nbsp;

## Motivation

When I started doing academic web projects, I felt the need for a build tool to merge all my JS files into one, cleaning the HTML pages and optimizing my workflow.<br/>
I wanted something simple and fast, so I built MergerJS to use in my small web-app projects.
