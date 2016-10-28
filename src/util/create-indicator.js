const { getReleaseErrors } = require('../schema');

const verifyRelease = (release, indicatorId) => {
  const errors = getReleaseErrors(release);
  if (errors !== null) {
    throw new Error(`Invalid release object passed to indicator ${indicatorId} - ${JSON.stringify(errors)}`);
  }
};

// const verifyResult = (result, indicatorId) => {
//   if (typeof result !== 'boolean') {
//     throw new Error(`Indicator ${indicatorId}'s testFunction returned type ${typeof result}. Non-boolean results should be handled by preconditions`);
//   }
// }

const createIndicator = (indicatorId, testFunction) => (release, testFunctionOptions) => {
  verifyRelease(release, indicatorId);

  const result = testFunction(release, testFunctionOptions);

  // verifyResult(result);

  return result;
};

module.exports = createIndicator;
