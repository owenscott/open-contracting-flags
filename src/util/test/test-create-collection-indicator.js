const test = require('tape');
const createCollectionIndicator = require('../create-collection-indicator.js');

test('createCollectionIndicator should pass back the results of a test function', assert => {
  assert.plan(1);
  const testFunction = () => ({ one: true });
  const indicator = createCollectionIndicator('myIndicator', testFunction);
  assert.deepEqual(indicator([{ id: 'one' }]), { one: true });
});

test('createCollectionIndicator throws if the test function returns an object with the wrong number of keys', assert => {
  assert.plan(1);
  const testFunction = () => ({ one: true, two: false, three: true });
  const indicator = createCollectionIndicator('myIndicator', testFunction);
  assert.throws(() => {
    indicator([ { id: 'one' }, { id: 'two' } ], {});
  });
});

test('createCollectionIndicator throws if the test function returns a key pointing to a non-boolean value', assert => {
  assert.plan(1);
  const testFunction = () => ({ one: true, two: null });
  const indicator = createCollectionIndicator('myIndicator', testFunction);
  assert.throws(() => {
    indicator([ { id: 'one' }, { id: 'two' } ]);
  });
});

test('createCollection passes back an appropriate result object for an input array', assert => {
  assert.plan(1);
  const testFunction = () => ({ one: true, two: false });
  const indicator = createCollectionIndicator('myIndicator', testFunction);
  const collection = [ { id: 'one' }, { id: 'two' } ];
  assert.deepEqual(indicator(collection), { one: true, two: false });
});

test('createCollection applies filters correctly', assert => {
  assert.plan(1);
  const testFunction = collection => collection.reduce(
    (result, el) => Object.assign({}, result, { [el.id]: el.value }),
    {}
  );
  const nullFilter = el => el.value !== null;
  const indicator = createCollectionIndicator('myIndicator', testFunction, {
    filters: [ nullFilter ]
  });
  const collection = [ { id: 'one', value: true }, { id: 'two', value: null }, { id: 'three', value: false } ];
  assert.deepEqual(indicator(collection), { one: true, three: false });
});

test('createCollection passes test options through to the test function', assert => {
  assert.plan(1);
  const testFunction = (collection, options) => {
    assert.strictEqual(options.something, true);
    return { one: false };
  };
  const indicator = createCollectionIndicator('myIndicator', testFunction);
  indicator([{ id: 'one' }], { something: true });
});
