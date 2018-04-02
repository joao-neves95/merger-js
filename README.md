# merger-js
 
 Yet another light weight and simple build tool for JavaScript files, with auto build capabilities and smart CLI tooling.
 
 **merjer *does not* support circular dependencies**
 
 **NPM:** [LINK](https://www.npmjs.com/package/merger-js)<br/>
 **License:** [MIT](https://github.com/joao-neves95/merger-js/blob/master/LICENSE)<br/>
 **Dependencies:**<br/>
 ├── [uglify-es](https://www.npmjs.com/package/uglify-es)<br/>
 ├── [async9](https://github.com/caolan/async)<br/>
 ├── [chokidar](https://github.com/paulmillr/chokidar)<br/>
 ├── [commander](https://github.com/tj/commander.js)<br/>
 ├── [inquirer](https://github.com/SBoudrias/Inquirer.js)<br/>
 
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

## Use

1) Run ```merger init``` on your working JS directory:
- If you run it on your working JS directory, the CLI tool will give you default file paths and names relative to that directory.
- In the question "File Order", input in which order you wish the files to be bundled. From first to last.

  (eg.: ```helpers.js, requests.js, handlers.js, listeners.js, feature.js```)

&nbsp;

2) After having a merger-config.json file on the source directory (the directory where your working files are located), you have different alternatives to run merger:
- You can run ```merger``` or ```merger build```, on the source directory, and the merger-config.json folder will be parsed and merger will build with the config you gave it on the config file.
- You can run ```merger auto``` or ```merger build auto``` to run in auto build mode (it watches the source directory for changes and builds when there's one), if you, for example, told the CLI that you didn't want auto builds and you don't want to that.
