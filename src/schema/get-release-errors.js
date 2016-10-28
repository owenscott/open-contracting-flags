const jsonschema = require('jsonschema');
const releaseSchema = require('./release.json');

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

  // coerce dates to strings
  const releaseCopy = JSON.parse(JSON.stringify(release));

  const result = validator.validate(releaseCopy, releaseSchema);

  if (result.errors.length > 0) {
    return result.errors;
  } else {
    return null;
  }
};

module.exports = getReleaseErrors;
