const { createIndicator, pricesExactlyDifferent } = require('../util');
const { hasAward } = require('../preconditions');

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
      } else if (pricesExactlyDifferent(inactiveAward.amount, activeAward.amount)) {
        flagged = true;
      }
    });
  });

  return flagged;

};

const i085 = createIndicator('i085', testFunction, {
  preconditions: [ hasAward ],
  requiredOCDSFields: [
    'awards.status',
    'awards.value.amount',
    'awards.value.currency'
  ],
  requiredOtherFields: []
});

module.exports = i085;
