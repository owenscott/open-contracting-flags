const { createIndicator } = require('../util');
const { hasAward } = require('../preconditions');

const haveExactDiff = (winningPrice, comparisonPrice) => {
  const prices = [winningPrice, comparisonPrice].sort();
  const percentDiff = (prices[1] - prices[0]) / prices[0];
  const reversePercentDiff = (prices[0] - prices[1]) / prices[1];
  return (percentDiff * 100) % 1 === 0 ||
    (reversePercentDiff * 100) % 1 === 0;
};

const requiredFields = [
  'awards.status',
  'awards.value.amount',
  'awards.value.currency'
];

const preconditions = [ hasAward ];

const testFunction = release => {

  let flagged = false;

  const activeAwards = release.awards
    .filter(a => a.status === 'active')
    .map(a => a.value);

  const inactiveAwards = release.awards
    .filter(a => a.status !== 'active')
    .map(a => a.value);

  inactiveAwards.forEach(inactiveAward => {
    activeAwards.forEach(activeAward => {
      if (inactiveAward.currency !== activeAward.currency) {
        throw new Error('Trying to compare bid amounts which are not in the same currency');
      } else if (haveExactDiff(inactiveAward.amount, activeAward.amount)) {
        flagged = true;
      }
    });
  });

  return flagged;

};

const indicatorFunction = createIndicator('i085', testFunction, { requiredFields, preconditions });

/**
 * Indicator 085: Bids are an exact percentage apart
 *
 * Calculation Method: Compare the winning bid against all other bids. If any of
 * the bids are an exact percentage apart, return `true`, otherwise return `false`.
 * Always compare bids by using the formula: (largest - smallest) / smallest.
 *
 * @param {object} release - An OCDS release object
 */
function i085(release) {
  return indicatorFunction(release);
}

module.exports = i085;
