/* eslint-disable no-console */

const { getReleaseErrors } = require('../schema');
const checkRequiredFields = require('./check-required-fields.js');

const verifyRelease = (release, indicatorId) => {
  const errors = getReleaseErrors(release);
  if (errors !== null) {
    throw new Error(`Invalid release object passed to indicator ${indicatorId} - ${JSON.stringify(errors)}`);
  }
};

const verifyResult = (result, indicatorId) => {
  if (typeof result !== 'boolean') {
    throw new Error(`Indicator ${indicatorId}'s test function returned type ${typeof result}. Non-boolean results should be handled by preconditions`);
  }
};

const createIndicator = (indicatorId, testFunction, options = {}) => (release, testFunctionOptions) => {

  const defaultOptions = { preconditions: [], requiredFields: [] };
  const { preconditions, requiredFields } = Object.assign({}, defaultOptions, options);

  if (process.env.NODE_ENV === 'testing' || process.env.NODE_ENV === 'development') {
    verifyRelease(release, indicatorId);
  }

  const requiredFieldErrors = checkRequiredFields(release, requiredFields);

  // if there are any missing fields we return null (e.g. not applicable)
  if (requiredFieldErrors !== null) {
    if (process.env.NODE_ENV === 'testing' || process.env.NODE_ENV === 'development') {
      console.warn(requiredFieldErrors);
    }
    return null;
  }

  for (let i = 0; i < preconditions.length; i++) {
    // if a precondition isn't met return null (e.g. not applicable)
    if (!preconditions[i](release)) {
      if (process.env.NODE_ENV === 'testing' || process.env.NODE_ENV === 'development') {
        console.warn(`${indicatorId} failed precondition ${preconditions[i].name}`);
      }
      return null;
    }
  }

  const result = testFunction(release, testFunctionOptions);

  verifyResult(result, indicatorId);

  return result;

};

module.exports = createIndicator;
