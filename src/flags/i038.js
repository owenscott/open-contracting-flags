const { createIndicator } = require('../util');

const requiredFields = [
  'tender.tenderPeriod.startDate',
  'tender.tenderPeriod.endDate'
];

const testFunction = (release, options) => {
  const { tender } = release;
  const { threshold } = options;
  const { tenderPeriod: { startDate, endDate } } = tender;
  const daysBetween = (endDate.getTime() - startDate.getTime()) / (24 * 3600 * 1000);
  return daysBetween < threshold;
};

const indicatorFunction = createIndicator('i038', testFunction, { requiredFields });

/**
 * Indicator 038: Allowing an unreasonable short time to respond to requests
 * for bids
 *
 * Calculation Method: Calculate the number of days between the
 * `tender.tenderPeriod.startDate` and `tender.tenderPeriod.endDate`, then
 * compare the result against the threshold
 *
 * @param {object} release - An OCDS release object
 * @param {int} threshold - The minimum number of days expected between the
 * `startDate` and `endDate` for a tender
 */
function i038(release, threshold) {
  return indicatorFunction(release, { threshold });
}

module.exports = i038;
