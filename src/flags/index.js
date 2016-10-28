const i038 = require('./i038.js');
const i171 = require('./i171.js');

const I038_THRESHOLD = 7;
const I171_THRESHOLD = 0.01;

module.exports = {
  i003: require('./i003.js'),
  i007: require('./i007.js'),
  i038: release => i038(release, I038_THRESHOLD),
  i085: require('./i085.js'),
  i171: release => i171(release, I171_THRESHOLD)
};
