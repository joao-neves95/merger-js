'use strict'
const fs = require('fs');
const path = require('path');
const readline = require('readline');

module.exports = (Path, Callback) => {
  let lineNum = 0;
  let buildOrder = [];
  buildOrder.push(path.basename(Path));

  const rl = readline.createInterface({
    input: fs.createReadStream(Path)
  });

  // Get all lines that start with @import comments from the top of the source page;
  // Remove "//" and "@import";
  // Store in array.
  rl.on('line', (line) => {
    let treatedLine = line.replace(/\s/g, '')
    if (treatedLine.startsWith('@import', 2)) {
      let file = treatedLine.replace(/\'|;|"|,|\/\/@import/g, '');
      lineNum++;
      if (path.extname(file) === '')
        file += '.js';
      if (buildOrder.includes(file))
        return
      buildOrder.push(file);
    } else if (lineNum >= 20 && !treatedLine.startsWith('//')) {
      rl.close();
    }
  });

  rl.on('close', () => {
    console.log(buildOrder)
    Callback(buildOrder);
  });
}
