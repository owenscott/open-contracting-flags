const test = require('tape');
const createIndicator = require('../create-indicator.js');

test('createIndicator should pass back the results of a test function', assert => {
  assert.plan(1);
  const testFunction = () => true;
  const indicator = createIndicator('myIndicator', testFunction);
  assert.strictEqual(indicator({}), true);
});

test('createIndicator should pass a release through to the test function', assert => {
  assert.plan(2);
  const testFunction = release => release.myCustomField;
  const indicator = createIndicator('myIndicator', testFunction);
  assert.strictEqual(indicator({ myCustomField: true }), true);
  assert.strictEqual(indicator({ myCustomField: false }), false);
});

test('createIndicator should throw if passed an invalid release object', assert => {
  assert.plan(1);
  const testFunction = relase => true;
  const indicator = createIndicator('myIndicator', testFunction);
  assert.throws(() => {
    indicator({ tender: 'not-even-an-object' });
  });
});
