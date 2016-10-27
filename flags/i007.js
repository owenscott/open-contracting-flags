/**
 * Indicator 007: This tender featured a single bidder only
 *
 * Calculation Method: Check if the count of unique bidders for each project
 * is greater than 1
 *
 * @param {object} release - An OCDS release object
 */
function calculateI007(release) {
  const { awards } = release;
  const uniqueSuppliers = awards
    .reduce((suppliers, award) => suppliers.concat(award.suppliers.map(s => s.id)), [])
    .filter((s, i, arr) => arr.indexOf(s) === i);
  return uniqueSuppliers.length === 1;
}

module.exports = calculateI007;

// TODO: what about multiple suppliers submitting shared bids
