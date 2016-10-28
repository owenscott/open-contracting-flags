const { createIndicator } = require('../util');
const { hasAward } = require('../preconditions');

const testFunction = (release, options) => {

  let flagged = false;

  const { awards, tender } = release;
  const { threshold } = options;
  const { value: estimatedPrice } = tender;

  const activeAwards = awards
    .filter(a => a.status === 'active')
    .map(a => a.value);

  activeAwards.forEach(award => {
    if (estimatedPrice.currency !== award.currency) {
      throw new Error('Trying to compare estimated price and winning bid w/ different currencies');
    }
    const percentDiff = Math.abs((estimatedPrice.amount - award.amount) / estimatedPrice.amount);
    if (percentDiff <= threshold) {
      flagged = true;
    }
  });

  return flagged;

};

const i171 = createIndicator('i171', testFunction, {
  preconditions: [ hasAward ],
  requiredOCDSFields: [
    'awards.status',
    'awards.value.amount',
    'awards.value.currency',
    'tender.value.amount',
    'tender.value.currency'
  ],
  requiredOtherFields: []
});

module.exports = i171;
