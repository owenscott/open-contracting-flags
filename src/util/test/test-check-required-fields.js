const test = require('tape');
const checkRequiredFields = require('../check-required-fields.js');

test('checkRequiredFields should return with the appropriate message if a field is missing', assert => {
  assert.plan(1);
  const result = checkRequiredFields({}, [ 'foo' ]);
  const expectedResult = [ 'field "foo" is required' ];
  assert.deepEqual(result, expectedResult);
});

test('checkRequiredFields should return null if the required field is present', assert => {
  assert.plan(1);
  const result = checkRequiredFields({ foo: 'bar' }, [ 'foo' ]);
  assert.strictEqual(result, null);
});

test('checkRequiredFields should return the appropriate message is a nested field is missing', assert => {
  assert.plan(1);
  const record = { foo: {} };
  const result = checkRequiredFields(record, [ 'foo.bar' ]);
  assert.deepEqual(result, [ 'field "foo.bar" is required' ]);
});

test('checkRequiredFields should return null if a nested field is present', assert => {
  assert.plan(1);
  const record = { foo: { bar: 42 } };
  const result = checkRequiredFields(record, [ 'foo.bar' ]);
  assert.strictEqual(result, null);
});

test('checkRequiredFields should return the appropriate message if a nested field is missing in an array', assert => {
  assert.plan(1);
  const record = {
    foo: [
      { bar: 42 },
      { derp: 12 },
      { bar: 53 }
    ]
  };
  const result = checkRequiredFields(record, [ 'foo.bar' ]);
  assert.deepEqual(result, [ 'field "foo.bar" is required' ]);
});

test('checkRequiredFields should return null if a nested field is present in an array', assert => {
  assert.plan(1);
  const record = {
    foo: [
      { bar: 42 },
      { bar: 43 }
    ]
  };
  const result = checkRequiredFields(record, [ 'foo.bar' ]);
  assert.strictEqual(result, null);
});

test('checkRequiredFields works for multiple fields', assert => {
  assert.plan(1);
  const record = {
    foo: [
      { bar: 42, derp: 12 },
      { derp: 23 }
    ],
    heck: 'yeah'
  };
  const result = checkRequiredFields(record, [ 'derp', 'foo.bar', 'foo.derp', 'heck', 'somethingElse' ]);
  const expectedResult = [
    'field "derp" is required',
    'field "foo.bar" is required',
    'field "somethingElse" is required'
  ];
  assert.deepEqual(result, expectedResult);
});

test('checkRequiredFields does not fail over empty arrays', assert => {
  assert.plan(1);
  const record = {
    award: []
  };
  const result = checkRequiredFields(record, [ 'award.value.amount' ]);
  assert.strictEqual(result, null);
});
