# MergerJS
[![npm](https://img.shields.io/npm/v/merger-js.svg)](https://www.npmjs.com/package/merger-js) [![LICENSE](https://img.shields.io/npm/l/merger-js.svg)](https://github.com/joao-neves95/merger-js/blob/master/LICENSE) 

 Yet another lightweight and simple cross-platform build tool for JavaScript files, with CLI tooling, file imports, auto build capabilities and native OS notifications.
 
 Because merger uses uglify-es for minification, you don't need to use any kind of transpilers in conjunction with this tool. You can use ES6+.
 
 This tool is intended for small projects.
 
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

&nbsp;

## Getting Started

For the latest version of the README, always refer to the MergerJS GitHub repository's master branch:<br/>
https://github.com/joao-neves95/merger-js/blob/master/README.md 


### 1) Node.js

You will need [Node.js](https://nodejs.org/en/) installed to run merger.

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

1) Choose a source file (the first file to be merged) and, on the top of that file, add comments importing the files in the order you want them to be built, from the first to the last.<br/>
   Just like in a browser.
   
   Example:
   ```
   // @import 'helpers'
   // @import 'requests'
   // @import 'handlers'
   // @import 'listeners'
   // @import 'feature'
   ```
   - Instead of ```// @import 'fileName'```, you can just ```// @'fileName'```;
   - The extension names ```.js``` are optional;
   - The import of the source file is optional;
   - You can import files from different directories relative to the same source file.<br/>
     Example: ```// @import '../otherFolder/someFile'```

&nbsp;

2) Run ```merger init``` on the root of your project:<br/>
  This will set up the configuration model as well as some global configurations (minification, auto builds on file changes, native OS notifications).<br/>
  You can alter them later through the CLI with the "merger set" command (learn more in "Commands").

&nbsp;

3) Run ```merger add``` to add a new source file to your merger configuration file (learn more in "Commands").

4) Run ```merger``` or ```merger build``` to start building (learn more in "Commands").

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

## Versioning

Merger uses [SemVer](https://semver.org/) for versioning. You can read the changelog [here](https://github.com/joao-neves95/merger-js/blob/master/CHANGELOG.md).

&nbsp;

## Code Style

**JavaScript Standard Style, *with semicolons*.**

I only do not use semicolons on browser JS.

&nbsp;

## Motivation

When I started doing academic web projects, I felt the need for a build tool to merge all my JS files into one, cleaning the HTML pages and optimizing my workflow.<br/>
I wanted something simple and fast, so I built MergerJS to use in my small web-app projects.
