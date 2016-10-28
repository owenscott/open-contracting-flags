const Immutable = require('immutable');
const jsonschema = require('jsonschema');
const releaseSchema = require('./release.json');
const dateToString = require('./date-to-string.js');

const DATE_FIELDS = [
  'tender.tenderPeriod.startDate',
  'tender.tenderPeriod.endDate'
];

// remove all mandatory fields to allow validation of simple unit test payloads
delete releaseSchema.required;
Object.keys(releaseSchema.definitions).forEach(sectionName => {
  delete releaseSchema.definitions[sectionName].required;
});

const validator = new jsonschema.Validator();

const getReleaseErrors = release => {
  if (typeof release !== 'object') {
    return [ 'release argument was not an object' ];
  }

  // test a copy of the release so we don't mutate the original
  const releaseCopy = Immutable.fromJS(release).toJS();

  // change the JavaScript date objects into date strings (JSON doesn't have Date objects)
  DATE_FIELDS.forEach(dateField => {
    dateToString(releaseCopy, dateField);
  });

  const result = validator.validate(releaseCopy, releaseSchema);

  if (result.errors.length > 0) {
    return result.errors;
  } else {
    return null;
  }
};

module.exports = getReleaseErrors;
