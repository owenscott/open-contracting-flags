/* eslint-disable no-console */

const typecheckRelease = require('./typecheck-release.js');
const checkRequiredFields = require('./check-required-fields.js');

const DEFAULT_OPTIONS = {
  preconditions: [],
  requiredOCDSFields: [],
  requiredCustomFields: []
};

const typecheckResult = (result, indicatorId) => {
  if (typeof result !== 'boolean') {
    throw new Error(`Indicator ${indicatorId}'s test function returned type ${typeof result}. Non-boolean results should be handled by preconditions`);
  }
  return result;
};

const createIndicator = (indicatorId, testFunction, options = {}) => {

  const { preconditions, requiredOCDSFields, requiredCustomFields } = Object.assign({}, DEFAULT_OPTIONS, options);

  const indicatorFunction = (release, testFunctionOptions) => {

    typecheckRelease(release, indicatorId);

    const requiredFields = requiredOCDSFields.concat(requiredCustomFields);
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

    return typecheckResult(result, indicatorId);

  };

  indicatorFunction.type = 'release';

  indicatorFunction.selfDocument = () => ({
    id: indicatorId,
    type: indicatorFunction.type,
    requiredOCDSFields,
    requiredCustomFields,
    preconditions: preconditions.map(p => p.selfDocument())
  });

  return indicatorFunction;

};

module.exports = createIndicator;
