const test = require('tape');
const hasAward = require('../has-award.js');

test('hasAward should return false for a release with no awards', assert => {
  assert.plan(1);
  const release = { awards: [] };
  assert.strictEqual(hasAward(release), false);
});

test('hasAward should return false when there is no active award', assert => {
  assert.plan(1);
  const release = { awards: [ { id: 1, status: 'unsuccessful' } ] };
  assert.strictEqual(hasAward(release), false);
});

test('hasAward should return true when there is an active award', assert => {
  assert.plan(1);
  const release = { awards: [ { id: 1, status: 'active' } ] };
  assert.strictEqual(hasAward(release), true);
});
