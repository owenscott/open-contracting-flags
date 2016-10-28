const assert = require('assert');

const getWinningBidValue = release => {
  const winners = release.awards.filter(a => a.status === 'active');
  if (winners.length > 1) {
    return null; // TODO: this is not the right behaviour
  }
  assert.ok(winners.length <= 1, 'There should only be at most one winner per tender');
  if (winners.length === 0) {
    return null;
  } else {
    return winners[0].value || null; // TODO: handle this more directly
  }
};

module.exports = getWinningBidValue;
