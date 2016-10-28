const flags = require('../src/flags');

const documentation = Object.keys(flags)
  .map(key => flags[key])
  .map(flag => flag.selfDocument());

console.log(documentation); // eslint-disable-line no-console
