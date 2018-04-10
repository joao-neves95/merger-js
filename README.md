# merger-js
[![npm](https://img.shields.io/npm/v/merger-js.svg)](https://www.npmjs.com/package/merger-js) [![LICENSE](https://img.shields.io/npm/l/merger-js.svg)](https://github.com/joao-neves95/merger-js/blob/master/LICENSE) 

 Yet another light weight and simple cross-platform build tool for JavaScript files, with file imports, auto build capabilities, smart CLI tooling and native OS notifications.
 
 Because merger uses uglify-es for minification, you don't need to use any kind of transpilers in conjunction with this tool. You can use ES6+.
 
 This tool is intended for **very** small projects.
 
 **merger *does not* support circular dependencies**
 
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

---
<br/>

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
   - The extension names ```.js``` are optional;
   - The import (```// @import```) of the source file is optional;
   - You can import files from different directories. Example:<br/>
     ```// @import '../otherFolder/someFile'```.

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
  - \<configuration\> ```mnfy```, ```minify``` or ```uglify``` and the \<value\> ```-t``` / ```--true``` or ```-f``` / ```--false``` to set minification to true or false (on/off);
  - \<configuration\> ```auto``` or ```autobuild``` and the \<value\> ```-t``` / ```--true``` or ```-f``` / ```--false``` to set auto builds to true or false (on/off);
  
  Examples: ```merger minify -f```, ```merger autobuild --true```.

&nbsp;

## Versioning

Merger uses [SemVer](https://semver.org/) for versioning. You can read the changelog [here](https://github.com/joao-neves95/merger-js/blob/master/CHANGELOG.md).
