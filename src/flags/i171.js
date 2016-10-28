const {
  createIndicator,
  getWinningBidValue
} = require('../util');

const testFunction = (release, options) => {
  const { tender } = release;
  const { threshold } = options;
  if (!tender || !tender.value) {
    return null;
  }
  const winningBid = getWinningBidValue(release);
  if (winningBid === null) {
    return null;
  }
  const { value: estimatedPrice } = tender;
  if (estimatedPrice.currency !== winningBid.currency) {
    throw new Error('i171 - trying to compare estimated price and winning bid w/ different currencies');
  }
  const percentDiff = Math.abs((estimatedPrice.amount - winningBid.amount) / estimatedPrice.amount);
  return percentDiff <= threshold;
};

const indicatorFunction = createIndicator('i171', testFunction);

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
