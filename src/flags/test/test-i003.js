// Indicator 003: Only winning bidder was eligible

const test = require('tape');
const i003 = require('../i003.js');

test('i003 should return false if there are no winners', assert => {
  assert.plan(1);
  const release = {
    awards: []
  };
  assert.strictEqual(i003(release), false);
});

test('i003 should return false if there are multiple eligible bidders', assert => {
  assert.plan(1);
  const release = {
    awards: [
      { id: 1, status: 'active', ineligibleYN: 'N' },
      { id: 2, status: 'unsuccessful', ineligibleYN: 'N' }
    ]
  };
  assert.strictEqual(i003(release), false);
});

test('i003 should return false if there is no winning bidder', assert => {
  assert.plan(1);
  const release = {
    awards: [
      { id: 1, status: 'unsuccessful', ineligibleYN: 'Y' },
      { id: 2, status: 'unsuccessful', ineligibleYN: 'Y' }
    ]
  };
  assert.strictEqual(i003(release), false);
});

test('i003 should return true if there is only one bidder', assert => {
  assert.plan(1);
  const release = {
    awards: [
      { status: 'active', ineligibleYN: 'N' }
    ]
  };
  assert.strictEqual(i003(release), true);
});

test('i003 should return true if there are multiple bidders but only winner is eligible', assert => {
  assert.plan(1);
  const release = {
    awards: [
      { id: 1, status: 'active', ineligibleYN: 'N' },
      { id: 2, status: 'unsuccessful', ineligibleYN: 'Y' },
      { id: 3, status: 'unsuccessful', ineligibleYN: 'Y' }
    ]
  };
  assert.strictEqual(i003(release), true);
});
