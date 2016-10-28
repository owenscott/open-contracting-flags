const { createIndicator } = require('../util');
const { hasAward } = require('../preconditions');

const requiredFields = [
  'awards.status',
  'awards.value.amount',
  'awards.value.currency',
  'tender.value.amount',
  'tender.value.currency'
];

const preconditions = [ hasAward ];

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

const indicatorFunction = createIndicator('i171', testFunction, { requiredFields, preconditions });

/**
 * Indicator 171: Bid is too close to budget, estimate or preferred solution
 *
 * Calculation Method: Use `tender.value` as the estimated price and
 * `award.value` where `award.status === 'active'` as the winning price.
 * Calcualte the difference using (estimated - winning) / estimated and
 * check if the difference is smaller than or equal to the threshold.
 *
 * @param {object} release - An OCDS release object
 * @param {float} theshold - The threshold (percentage) for a bid to be
 * considered "too close" to estimated price
 */
function i171(release, threshold) {
  return indicatorFunction(release, { threshold });
}

module.exports = i171;
