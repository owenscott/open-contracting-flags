const { createPrecondition } = require('../util');

const description = 'The release must have one or more awards with `status === \'active\'`';

const testFunction = release =>
  release.awards.reduce(
    (result, award) => award.status === 'active' ? true : result,
    false
  );

const precondition = createPrecondition('Has Active Award', testFunction, { description });

module.exports = precondition;
