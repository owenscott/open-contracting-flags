const path = require('path');
const fs = require('fs');
const { version } = require('../package.json');
const flags = require('../src/flags');
const versionTemplate = require('./templates/version.js');
const indexTemplate = require('./templates/index.js');

const indexPath = path.join(__dirname, '..', 'static');
const versionPath = path.join(indexPath, 'versions');

const indicators = Object.keys(flags).map(flagId => flags[flagId].selfDocument());

const versionPage = versionTemplate({ version, indicators });

fs.writeFileSync(path.join(versionPath, `${version}.html`), versionPage);

const versions = fs.readdirSync(versionPath)
  .filter(fileName => fileName.indexOf('.html') > -1);

const indexPage = indexTemplate({ versions });

fs.writeFileSync(path.join(indexPath, 'index.html'), indexPage);
