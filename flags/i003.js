/**
 * Indicator 003: Only winning bidder was eligible
 *
 * Calculation Method: Checks all award records and verifies their values for
 * `ineligibleYN`. If only the winning bid is eligible then returns `true`,
 * otherwise returns `false`
 *
 * @param {object} release - An OCDS release object
 */

function calculateI003(release) {
  const { awards } = release;

  const losersIneligible = awards
    .filter(a => a.status !== 'active')
    .reduce((ineligible, a) => a.ineligibleYN === 'N' ? false : ineligible, true);

  const hasWinner = awards.filter(a => a.status === 'active').length > 0;

  return hasWinner && losersIneligible;
}

module.exports = calculateI003;

// TODO: is `ineligibleYN` a proper OCDS field or is there something better?
