const test = require('tape');
const getReleaseErrors = require('../get-release-errors.js');

test('getReleaseErrors should return null for an empty object', assert => {
  assert.plan(1);
  const release = {};
  assert.strictEqual(getReleaseErrors(release), null);
});

test('getReleaseErrors should return null for a correct partial object', assert => {
  assert.plan(1);
  const release = {
    tender: { value: { amount: 1000, currency: 'USD' } }
  };
  assert.strictEqual(getReleaseErrors(release), null);
});

test('getReleaseErrors should return an error for an incorrect partial object', assert => {
  assert.plan(2);
  const release = {
    tender: { value: { amount: '1000', currency: 'USD' } }
  };
  const result = getReleaseErrors(release);
  assert.strictEqual(result.length, 1);
  assert.strictEqual(result[0].message, 'is not of a type(s) number,null');
});
