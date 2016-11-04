// Indicator 171: Bid is too close to budget, estimate or preferred solution

const test = require('tape');
const i171 = require('../i171.js');

test('i171 returns null if there is no estimated price', assert => {
  assert.plan(2);
  const release = {
    tender: {}
  };
  const releaseString = JSON.stringify(release);
  assert.strictEqual(i171(release, { threshold: 0.1 }), null);
  assert.strictEqual(JSON.stringify(release), releaseString, 'not mutated');
});

test('i171 returns null if there is no winning bid', assert => {
  assert.plan(2);
  const release = {
    tender: { value: { amount: 1000, currency: 'USD' } },
    awards: []
  };
  const releaseString = JSON.stringify(release);
  assert.strictEqual(i171(release, { threshold: 0.1 }), null);
  assert.strictEqual(JSON.stringify(release), releaseString, 'not mutated');
});

test('i171 returns false if the winning bid is outside of the threshold', assert => {
  assert.plan(2);
  const release = {
    tender: { value: { amount: 1000, currency: 'USD' } },
    awards: [
      { status: 'active', value: { amount: 1500, currency: 'USD' } }
    ]
  };
  const releaseString = JSON.stringify(release);
  assert.strictEqual(i171(release, { threshold: 0.1 }), false);
  assert.strictEqual(JSON.stringify(release), releaseString, 'not mutated');
});

test('i171 returns true if the winning bid is within the threshold', assert => {
  assert.plan(2);
  const release = {
    tender: { value: { amount: 1000, currency: 'USD' } },
    awards: [
      { status: 'active', value: { amount: 1010, currency: 'USD' } }
    ]
  };
  const releaseString = JSON.stringify(release);
  assert.strictEqual(i171(release, { threshold: 0.1 }), true);
  assert.strictEqual(JSON.stringify(release), releaseString, 'not mutated');
});

test('i171 returns true if the winning bid is exactly at the threshold', assert => {
  assert.plan(2);
  const release = {
    tender: { value: { amount: 1000, currency: 'USD' } },
    awards: [
      { status: 'active', value: { amount: 1100, currency: 'USD' } }
    ]
  };
  const releaseString = JSON.stringify(release);
  assert.strictEqual(i171(release, { threshold: 0.1 }), true);
  assert.strictEqual(JSON.stringify(release), releaseString, 'not mutated');
});

test('i171 returns true if the winning bid is the same as the expected value', assert => {
  assert.plan(2);
  const release = {
    tender: { value: { amount: 1000, currency: 'USD' } },
    awards: [
      { status: 'active', value: { amount: 1000, currency: 'USD' } }
    ]
  };
  const releaseString = JSON.stringify(release);
  assert.strictEqual(i171(release, { threshold: 0.1 }), true);
  assert.strictEqual(JSON.stringify(release), releaseString, 'not mutated');
});

test('i171 thros if teh winning bid and the estimated value are in different currencies', assert => {
  assert.plan(2);
  const release = {
    tender: { value: { amount: 1000, currency: 'USD' } },
    awards: [
      { status: 'active', value: { amount: 1500, currency: 'CAD' } }
    ]
  };
  const releaseString = JSON.stringify(release);
  assert.throws(() => {
    i171(release, { threshold: 0.1 });
  });
  assert.strictEqual(JSON.stringify(release), releaseString, 'not mutated');
});
