const test = require('tape');
const createIndicator = require('../create-indicator.js');
const createPrecondition = require('../create-precondition.js');

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

test('the function returned by createIndicator should be able to self-document', assert => {
  assert.plan(1);
  const testFunction = release => true;
  const indicator = createIndicator('myIndicator', testFunction);
  const result = indicator.selfDocument();
  const expectedResult = {
    id: 'myIndicator',
    preconditions: [],
    requiredOCDSFields: [],
    requiredCustomFields: []
  };
  assert.deepEqual(result, expectedResult);
});

test('indicator self-documenting should work with preconditions which also self document', assert => {
  assert.plan(1);
  const testFunction = release => true;
  const precondition1 = createPrecondition('myFirstPrecondition', () => true, { description: 'foo' });
  const precondition2 = createPrecondition('mySecondPrecondition', () => true, { description: 'bar' });
  const indicator = createIndicator('myIndicator', testFunction, {
    preconditions: [ precondition1, precondition2 ],
    requiredOCDSFields: [ 'tender.tenderPeriod.startDate', 'tender.tenderPeriod.endDate' ],
    requiredCustomFields: [ 'someCustomField' ]
  });
  const result = indicator.selfDocument();
  const expectedResult = {
    id: 'myIndicator',
    preconditions: [
      { name: 'myFirstPrecondition', description: 'foo' },
      { name: 'mySecondPrecondition', description: 'bar' }
    ],
    requiredOCDSFields: [ 'tender.tenderPeriod.startDate', 'tender.tenderPeriod.endDate' ],
    requiredCustomFields: [ 'someCustomField' ]
  };
  assert.deepEqual(result, expectedResult);
});
