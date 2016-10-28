/* eslint-disable no-console */

const fs = require('fs');
const path = require('path');
const mongodb = require('mongodb');
const { mongoUri } = require('../config.js');
const flags = require('../src/flags');

const outFile = `release-${new Date().getTime()}.csv`;
const outPath = path.join(__dirname, '..', 'output', outFile);

const setup = [ mongodb.connect(mongoUri), fs.createWriteStream(outPath) ];

const indicators = Object.keys(flags);

const cleanup = (dbConnection, writeStream) =>
  Promise.all([dbConnection.close(), writeStream.end()])
    .catch(err => console.log(err));

const evaluateRelease = (release, writeStream) => {
  const results = indicators.map(i => {
    const result = flags[i](release);
    return result === null ? 'null' : result;
  });
  return writeStream.write(`${[ release.ocid, ...results ].join(',')}\n`);
};

Promise.all(setup)
  .then(([dbConnection, writeStream]) => {
    writeStream.write(`${[ 'ocid', ...indicators].join(',')}\n`);
    const evaluateReleases = new Promise((resolve, reject) => {
      const cursor = dbConnection.collection('release').find();
      cursor.forEach(release => evaluateRelease(release, writeStream), err => {
        if (err) reject(err);
        resolve();
      });
    });
    return evaluateReleases
      .then(() => cleanup(dbConnection, writeStream))
      .catch(err => {
        console.log(err);
        return cleanup(dbConnection, writeStream);
      });
  })
  .catch(err => {
    console.log(err);
  });
