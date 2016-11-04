const mongodb = require('mongodb');
const { i180 } = require('../src/flags');
const conf = require('../config.js');

mongodb.connect(conf.mongoUri)
  .then(dbConnection => dbConnection.collection('release').find().toArray())
  .then(releases => {
    const result = i180(releases, { threshold: 365 });
    console.log(result); // eslint-disable-line no-console
  })
  .catch(err => {
    console.log(err.stack); // eslint-disable-line no-console
  });
