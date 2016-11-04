const test = require('tape');
const deepUnwind = require('../deep-unwind.js');

test('deepUnwind works for a single array', assert => {
  assert.plan(1);
  const collection = [
    { _id: 'one', things: [1, 2, 3] },
    { _id: 'two', things: [4, 5] }
  ];
  const expectedResult = [
    { _id: 'one', thing: 1 },
    { _id: 'one', thing: 2 },
    { _id: 'one', thing: 3 },
    { _id: 'two', thing: 4 },
    { _id: 'two', thing: 5 }
  ];
  const result = deepUnwind(collection, 'things', 'thing');
  assert.deepEqual(result, expectedResult);
});

// note: there's no technical limitation here, this just seems like it would be
// a coding mistake instead of something intentional
test('deepUnwind throws if you try to rename a non-array key', assert => {
  assert.plan(1);
  const collection = [ { _id: 'one' } ];
  assert.throws(() => {
    deepUnwind(collection, '_id', 'id');
  });
});

test('deepUnwind works for an array at depth 2', assert => {
  assert.plan(1);
  const collection = [
    { _id: 'one', thing: { things: [ 1, 2 ] } },
    { _id: 'two', thing: { things: [ 3 ] } }
  ];
  const expectedResult = [
    { _id: 'one', thing: { thing: 1 } },
    { _id: 'one', thing: { thing: 2 } },
    { _id: 'two', thing: { thing: 3 } }
  ];
  const result = deepUnwind(collection, 'thing.things', 'thing.thing');
  assert.deepEqual(result, expectedResult);
});

test('deepUnwind works for arrays within arrays', assert => {
  assert.plan(1);
  const collection = [
    {
      _id: 'releaseOne',
      method: 'open',
      awards: [
        { amount: 20, suppliers: [ { _id: 'supplierOne' }, { _id: 'supplierTwo' } ] },
        { amount: 30, suppliers: [ { _id: 'supplierTwo' } ] }
      ]
    },
    {
      _id: 'releaseTwo',
      method: 'limited',
      awards: [
        { amount: 10, suppliers: [ { _id: 'supplierTwo' } ] }
      ]
    }
  ];
  const expectedResult = [
    { _id: 'releaseOne', method: 'open', award: { amount: 20, supplier: { _id: 'supplierOne' } } },
    { _id: 'releaseOne', method: 'open', award: { amount: 20, supplier: { _id: 'supplierTwo' } } },
    { _id: 'releaseOne', method: 'open', award: { amount: 30, supplier: { _id: 'supplierTwo' } } },
    { _id: 'releaseTwo', method: 'limited', award: { amount: 10, supplier: { _id: 'supplierTwo' } } }
  ];
  const result = deepUnwind(collection, 'awards.suppliers', 'award.supplier');
  assert.deepEqual(result, expectedResult);
});
