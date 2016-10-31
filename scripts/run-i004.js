const mongodb = require('mongodb');
const { i004 } = require('../src/flags');
const conf = require('../config.js');

mongodb.connect(conf.mongoUri)
  .then(dbConnection => dbConnection.collection('release').find().toArray())
  .then(releases => {
    const result = i004(releases, { threshold: 0.20, soleSourceLimit: 1000000000 });
    console.log(result); // eslint-disable-line no-console
  });
