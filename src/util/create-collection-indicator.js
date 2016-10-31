const assert = require('assert');
const typecheckRelease = require('./typecheck-release.js');
const checkRequiredFields = require('./check-required-fields.js');

const DEFAULT_OPTIONS = {
  filters: [],
  requiredOCDSFields: [],
  requiredCustomFields: []
};

const typecheckResult = (result, expectedLength, indicatorId) => {

  assert.strictEqual(
    typeof result,
    'object',
    `Indicator ${indicatorId}'s test function did not return an object. Instead returned type: ${typeof result}`
  );

  assert.strictEqual(
    Object.keys(result).length,
    expectedLength,
    `Indicator ${indicatorId}'s test function returned results for ${Object.keys(result).length} records. Expected ${expectedLength}`
  );

  Object.keys(result).forEach(releaseId => {
    assert.strictEqual(
      typeof result[releaseId],
     'boolean',
      `Indicator ${indicatorId}'s test function returned type ${typeof result}. Non-boolean results should be handled by filters`
    );
  });

  return result;
};

const createCollectionIndicator = (indicatorId, testFunction, options = {}) => {

  const { filters, requiredOCDSFields, requiredCustomFields } = Object.assign({}, DEFAULT_OPTIONS, options);
  const requiredFields = requiredOCDSFields.concat(requiredCustomFields);

  const indicatorFunction = (collection, testFunctionOptions) => {

    let filteredCollection = collection
      .filter(release => {
        const requiredFieldErrors = checkRequiredFields(release, requiredFields);
        if (requiredFieldErrors !== null && process.env.NODE_ENV === 'testing') {
          console.warn(requiredFieldErrors); // eslint-disable-line no-console
        }
        return requiredFieldErrors === null;
      });

    filters.forEach(f => {
      filteredCollection = filteredCollection.filter(f);
    });

    filteredCollection.forEach(release => typecheckRelease(release)); // only runs in testing

    if (filteredCollection.length === 0) {
      return null;
    } else {
      return typecheckResult(
        testFunction(filteredCollection, testFunctionOptions || {}),
        filteredCollection.length,
        indicatorId
      );
    }

  };

  indicatorFunction.selfDocument = () => ({
    id: indicatorId,
    type: 'collection',
    requiredOCDSFields,
    requiredCustomFields,
    filters: filters.map(f => f.selfDocument())
  });

  return indicatorFunction;

};

module.exports = createCollectionIndicator;
