const test = require('tape');
const i007 = require('../i007.js');

test('i007 should return null when there are no suppliers', assert => {
  assert.plan(1);
  const release = {
    awards: []
  };
  assert.strictEqual(i007(release), null);
});

test('i007 should return false when there are multiple suppliers', assert => {
  assert.plan(1);
  const release = {
    awards: [
      { suppliers: [ { id: '123' }], status: 'active' },
      { suppliers: [ { id: 'abc' }], status: 'unsuccessful' }
    ]
  };
  assert.strictEqual(i007(release), false);
});

test('i007 should return true when there is only one supplier', assert => {
  assert.plan(1);
  const release = {
    awards: [
      { suppliers: [ { id: '123' }], status: 'active' }
    ]
  };
  assert.strictEqual(i007(release), true);
});

test('i007 should return true if only one supplier submits mutiple bids', assert => {
  assert.plan(1);
  const release = {
    awards: [
      { suppliers: [ { id: '123' }], status: 'active' },
      { suppliers: [ { id: '123' }], status: 'unsuccessful' }
    ]
  };
  assert.strictEqual(i007(release), true);
});

// TODO: not yet implemented and indicator logic still unclear
test.skip('i007 should return true if there are multiple suppliers but only one bid', assert => {
  assert.plan(1);
  const release = {
    awards: [
      { suppliers: [ { id: '123' }, { ids: 'abc' } ]}
    ]
  };
  assert.strictEqual(i007(release), true);
});
