const {
  createIndicator,
  getWinningBidValue
} = require('../util');
const { hasAward } = require('../preconditions');

const haveExactDiff = (winningPrice, comparisonPrice) => {
  const prices = [winningPrice, comparisonPrice].sort();
  const percentDiff = (prices[1] - prices[0]) / prices[0];
  return (percentDiff * 100) % 1 === 0;
};

const requiredFields = [
  'awards.status',
  'awards.value.amount',
  'awards.value.currency'
];

const preconditions = [ hasAward ];

const testFunction = release => {
  let flagResult = false;
  const winningValue = getWinningBidValue(release);
  const otherBids = release.awards
    .filter(a => a.status !== 'active');
  otherBids.forEach(bid => {
    const bidValue = bid.value;
    if (bidValue.currency !== winningValue.currency) {
      throw new Error('trying to compare bid amounts which are not in the same currency');
    } else if (haveExactDiff(bidValue.amount, winningValue.amount)) {
      flagResult = true;
    }
  });
  return flagResult;
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
