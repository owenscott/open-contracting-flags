const path = require('path');
const fs = require('fs');

const csvFiles =
  fs.readdirSync(path.join(__dirname, '..', 'output'))
    .filter(fileName => /^release-[0-9]+\.csv$/.test(fileName));

csvFiles.forEach(fileName => fs.unlink(path.join(__dirname, '..', 'output', fileName)));
