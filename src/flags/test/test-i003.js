// Indicator 003: Only winning bidder was eligible

const test = require('tape');
const i003 = require('../i003.js');

test('i003 should return null if there are no winners', assert => {
  assert.plan(2);
  const release = {
    awards: []
  };
  const releaseString = JSON.stringify(release);
  assert.strictEqual(i003(release), null);
  assert.strictEqual(JSON.stringify(release), releaseString, 'not mutated');
});

test('i003 should return false if there are multiple eligible bidders', assert => {
  assert.plan(2);
  const release = {
    awards: [
      { id: 1, status: 'active', inelibigleYN: 'N' },
      { id: 2, status: 'unsuccessful', inelibigleYN: 'N' }
    ]
  };
  const releaseString = JSON.stringify(release);
  assert.strictEqual(i003(release), false);
  assert.strictEqual(JSON.stringify(release), releaseString, 'not mutated');
});

test('i003 should return false if there is no winning bidder', assert => {
  assert.plan(2);
  const release = {
    awards: [
      { id: 1, status: 'unsuccessful', inelibigleYN: 'Y' },
      { id: 2, status: 'unsuccessful', inelibigleYN: 'Y' }
    ]
  };
  const releaseString = JSON.stringify(release);
  assert.strictEqual(i003(release), null);
  assert.strictEqual(JSON.stringify(release), releaseString, 'not mutated');
});

test('i003 should return true if there is only one bidder', assert => {
  assert.plan(2);
  const release = {
    awards: [
      { status: 'active', inelibigleYN: 'N' }
    ]
  };
  const releaseString = JSON.stringify(release);
  assert.strictEqual(i003(release), true);
  assert.strictEqual(JSON.stringify(release), releaseString, 'not mutated');
});

test('i003 should return true if there are multiple bidders but only winner is eligible', assert => {
  assert.plan(2);
  const release = {
    awards: [
      { id: 1, status: 'active', inelibigleYN: 'N' },
      { id: 2, status: 'unsuccessful', inelibigleYN: 'Y' },
      { id: 3, status: 'unsuccessful', inelibigleYN: 'Y' }
    ]
  };
  const releaseString = JSON.stringify(release);
  assert.strictEqual(i003(release), true);
  assert.strictEqual(JSON.stringify(release), releaseString, 'not mutated');
});
