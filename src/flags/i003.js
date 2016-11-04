// Indicator 003: Only winning bidder was eligible

const { createIndicator } = require('../util');
const { hasAward } = require('../preconditions');

const testFunction = release => {

  const { awards } = release;

  const losersIneligible = awards
    .filter(a => a.status !== 'active')
    .reduce((ineligible, a) => a.inelibigleYN === 'N' ? false : ineligible, true);

  return losersIneligible;

};

const i003 = createIndicator('i003', testFunction, {
  preconditions: [ hasAward ],
  requiredOCDSFields: [ 'awards.status' ],
  requiredCustomFields: [ 'awards.inelibigleYN' ]
});

module.exports = i003;
