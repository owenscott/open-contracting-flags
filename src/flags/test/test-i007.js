const test = require('tape');
const i007 = require('../i007.js');

test('i007 should return null when there are no suppliers', assert => {
  assert.plan(2);
  const release = {
    awards: []
  };
  const releaseString = JSON.stringify(release);
  assert.strictEqual(i007(release), null);
  assert.strictEqual(JSON.stringify(release), releaseString, 'not mutated');
});

test('i007 should return false when there are multiple suppliers', assert => {
  assert.plan(2);
  const release = {
    awards: [
      { suppliers: [ { id: '123' }], status: 'active' },
      { suppliers: [ { id: 'abc' }], status: 'unsuccessful' }
    ]
  };
  const releaseString = JSON.stringify(release);
  assert.strictEqual(i007(release), false);
  assert.strictEqual(JSON.stringify(release), releaseString, 'not mutated');
});

test('i007 should return true when there is only one supplier', assert => {
  assert.plan(2);
  const release = {
    awards: [
      { suppliers: [ { id: '123' }], status: 'active' }
    ]
  };
  const releaseString = JSON.stringify(release);
  assert.strictEqual(i007(release), true);
  assert.strictEqual(JSON.stringify(release), releaseString, 'not mutated');
});

test('i007 should return true if only one supplier submits mutiple bids', assert => {
  assert.plan(2);
  const release = {
    awards: [
      { suppliers: [ { id: '123' }], status: 'active' },
      { suppliers: [ { id: '123' }], status: 'unsuccessful' }
    ]
  };
  const releaseString = JSON.stringify(release);
  assert.strictEqual(i007(release), true);
  assert.strictEqual(JSON.stringify(release), releaseString, 'not mutated');
});

// TODO: not yet implemented and indicator logic still unclear
test.skip('i007 should return true if there are multiple suppliers but only one bid', assert => {
  assert.plan(2);
  const release = {
    awards: [
      { suppliers: [ { id: '123' }, { ids: 'abc' } ]}
    ]
  };
  const releaseString = JSON.stringify(release);
  assert.strictEqual(i007(release), true);
  assert.strictEqual(JSON.stringify(release), releaseString, 'not mutated');
});
