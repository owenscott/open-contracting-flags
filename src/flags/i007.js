// Indicator 007: This tender featured a single bidder only

const { createIndicator } = require('../util');
const { hasAward } = require('../preconditions');

const testFunction = release => {
  const { awards } = release;
  const uniqueSuppliers = awards
    .reduce((suppliers, award) => suppliers.concat(award.suppliers.map(s => s.id)), [])
    .filter((s, i, arr) => arr.indexOf(s) === i);
  return uniqueSuppliers.length === 1;
};

const i007 = createIndicator('i007', testFunction, {
  preconditions: [ hasAward ],
  requiredOCDSFields: [ 'awards.suppliers.id' ],
  requiredCustomFields: []
});

module.exports = i007;

// TODO: what about multiple suppliers submitting shared bids
