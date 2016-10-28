const { createIndicator } = require('../util');

const testFunction = release => {
  const { awards } = release;

  const losersIneligible = awards
    .filter(a => a.status !== 'active')
    .reduce((ineligible, a) => a.ineligibleYN === 'N' ? false : ineligible, true);

  const hasWinner = awards.filter(a => a.status === 'active').length > 0;

  return hasWinner && losersIneligible;
};

const indicatorFunction = createIndicator('i003', testFunction);

/**
 * Indicator 003: Only winning bidder was eligible
 *
 * Calculation Method: Checks all award records and verifies their values for
 * `ineligibleYN`. If only the winning bid is eligible then returns `true`,
 * otherwise returns `false`
 *
 * @param {object} release - An OCDS release object
 */
function i003(release) {
  return indicatorFunction(release);
}

module.exports = i003;
