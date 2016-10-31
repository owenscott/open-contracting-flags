const { createPrecondition } = require('../util');

const description = 'The release\'s tender must use the "limited" procurement method';

const testFunction = release =>
  // see: http://standard.open-contracting.org/latest/en/schema/codelists/#method
  release.tender.procurementMethod === 'limited';

const precondition = createPrecondition('Is Limited', testFunction, { description });

module.exports = precondition;
