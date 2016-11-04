// i085: Bids are an exact percentage apart

const test = require('tape');
const i085 = require('../i085.js');

test('i085 returns null if there is no winning bidder', assert => {
  assert.plan(2);
  const release = {
    awards: []
  };
  const releaseString = JSON.stringify(release);
  assert.strictEqual(i085(release), null);
  assert.strictEqual(JSON.stringify(release), releaseString, 'not mutated');
});

test('i085 returns false if the only bid is the winning bidder', assert => {
  assert.plan(2);
  const release = {
    awards: [
      { status: 'active', value: { amount: 1000, currency: 'USD' } }
    ]
  };
  const releaseString = JSON.stringify(release);
  assert.strictEqual(i085(release), false);
  assert.strictEqual(JSON.stringify(release), releaseString, 'not mutated');
});

test('i085 returns false if there are multiple bids with an inexact difference', assert => {
  assert.plan(2);
  const release = {
    awards: [
      { status: 'active', value: { amount: 1000, currency: 'USD' } },
      { status: 'unsuccessful', value: { amount: 1004, currency: 'USD' } } // 0.4% difference
    ]
  };
  const releaseString = JSON.stringify(release);
  assert.strictEqual(i085(release), false);
  assert.strictEqual(JSON.stringify(release), releaseString, 'not mutated');
});

test('i085 returns true if one losing bid is an exact percentage difference from the winner', assert => {
  assert.plan(2);
  const release = {
    awards: [
      { status: 'active', value: { amount: 1000, currency: 'USD' } },
      { status: 'unsuccessful', value: { amount: 1100, currency: 'USD' } } // 10% difference
    ]
  };
  const releaseString = JSON.stringify(release);
  assert.strictEqual(i085(release), true);
  assert.strictEqual(JSON.stringify(release), releaseString, 'not mutated');
});

test('i085 returns true if one losing bid is exactly different, even if other bids are not', assert => {
  assert.plan(2);
  const release = {
    awards: [
      { status: 'active', value: { amount: 1000, currency: 'USD' } },
      { status: 'unsuccessful', value: { amount: 1004, currency: 'USD' } }, // 0.4% difference
      { status: 'unsuccessful', value: { amount: 1100, currency: 'USD' } } // 10% difference
    ]
  };
  const releaseString = JSON.stringify(release);
  assert.strictEqual(i085(release), true);
  assert.strictEqual(JSON.stringify(release), releaseString, 'not mutated');
});

test('i085 is not affected by the direction of the comparison', assert => {
  assert.plan(4);
  const release1 = {
    awards: [
      { status: 'active', value: { amount: 1000, currency: 'USD' } },
      { status: 'unsuccessful', value: { amount: 1100, currency: 'USD' } }
    ]
  };
  const release2 = {
    awards: [
      { status: 'active', value: { amount: 1100, currency: 'USD' } },
      { status: 'unsuccessful', value: { amount: 1000, currency: 'USD' } }
    ]
  };
  const release1String = JSON.stringify(release1);
  const release2String = JSON.stringify(release2);
  assert.strictEqual(i085(release1), true);
  assert.strictEqual(i085(release2), true);
  assert.strictEqual(JSON.stringify(release1), release1String, 'not mutated');
  assert.strictEqual(JSON.stringify(release2), release2String, 'not mutated');
});

test('i085 throws if bids are not in the same currency', assert => {
  assert.plan(2);
  const release = {
    awards: [
      { status: 'active', value: { amount: 1000, currency: 'USD' } },
      { status: 'unsuccessful', value: { amount: 1100, currency: 'CAD' } }
    ]
  };
  const releaseString = JSON.stringify(release);
  assert.throws(() => {
    i085(release);
  });
  assert.strictEqual(JSON.stringify(release), releaseString, 'not mutated');
});
