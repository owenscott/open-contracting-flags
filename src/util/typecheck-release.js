const { getReleaseErrors } = require('../schema');

const verifyRelease = (release, indicatorId) => {
  const errors = getReleaseErrors(release);
  if (errors !== null) {
    throw new Error(`Invalid release object passed to indicator ${indicatorId} - ${JSON.stringify(errors)}`);
  }
};

const typecheckRelease = (release, indicatorId) => {
  if (process.env.NODE_ENV === 'testing' || process.env.NODE_ENV === 'development') {
    verifyRelease(release, indicatorId);
  }
};

module.exports = typecheckRelease;
