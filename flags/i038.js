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
function calculateI038(release, threshold) {
  const { tender } = release;
  if (!tender || !tender.tenderPeriod) return null;
  const { tenderPeriod: { startDate, endDate } } = tender;
  const daysBetween = (endDate.getTime() - startDate.getTime()) / (24 * 3600 * 1000);
  return daysBetween < threshold;
}

module.exports = calculateI038;
