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

 ## IMPORTANT NOTICE FOR PEOPLE WHO USE MERGER JS v2+
 
 I will start working on the (final) v3 of MergerJS and **there will be significant breaking changes**.
 
 I feel the need to have multiple source files in order to be able to make different build files. <br/>
 (To use different JS build files on different HTML pages, for example)
 
 To do that I will need to change the merger-config model, as well as the MergerJS CLI tool.

 V3 will be the last major version of MergerJS. After v3 there will be only bug fixes, improvements, refactorings and other **minor** features, always keeping this project simple and lightweight. 

<br/>

 ---

<br/>

## Features
 - [x] **CLI tooling**
 - [x] **Merge multiple JS files into one**
 - [x] **Use @import comments on a source file to specify the build order**
 - [x] **Minification, supporting ES6+** (optional)
 - [x] **Auto builds on files changes** (optional)
 - [x] **Native OS build notifications** (optional)
 - [ ] **Support multiple source files** (TODO)

&nbsp;

## Getting Started

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

2) Run ```merger init``` on your working JS directory:
- If you run merger on your working JS directory, the CLI tool will give you default paths relative to that directory.
- You can set minify to 'Yes', to minify on build.
- You can set autoBuild to 'Yes', to make merger listen for file changes and build automatically when there's one. 

&nbsp;

3) After having a merger-config.json file on the source directory (the directory where your working files are located), you have different alternatives to run merger:
- You can run ```merger``` or ```merger build```, on the source directory, and the merger-config.json folder will be parsed and merger will build with the config you gave it on the config file.
- You can run ```merger auto``` or ```merger build auto``` to run a one time auto build session (it watches the source directory for changes and builds when there's one), if you, for example, told the CLI that you didn't want auto builds and you don't want to change that.

&nbsp;

## Commands

The merger commands are to be made on the directory with the merger-config.json file.

- ```merger init```: Configure merger. It creates a merger-config.json file on your working directory.

- ```merger``` or ```merger build```: Execute the build with the configuration you gave it on the merger-config.json file.
  - ```merger auto```, ```merger build -a``` or ```merger build --auto```: Execute an automatic build session. You can do this, for example, when you have auto builds turned of and you don't want to change that.
- ```merger update```: Update MergerJS.
- ```merger set <configuration> <value>```: Edit a configuration key on the merger-config file.<br/>
  At the moment you can pass:
  - The \<configuration\> ```mnfy```, ```minify``` or ```uglify``` and the \<value\> ```-t``` / ```--true``` or ```-f``` / ```--false``` to set minification to true or false (on/off);
  - The \<configuration\> ```auto``` or ```autobuild``` and the \<value\> ```-t``` / ```--true``` or ```-f``` / ```--false``` to set auto builds to true or false (on/off);
  - The \<configuration\> ```ntfs```, ```notifs```, or ```notifications``` and the \<value\> ```-t``` / ```--true``` or ```-f``` / ```--false``` to set the native OS notifications to true or false (on/off);
  
  Examples: ```merger set minify -f```, ```merger set autobuild --true```.

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
