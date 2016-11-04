const test = require('tape');
const groupBySupplier = require('../group-by-supplier.js');

test('groupBySupplier groups tenders by supplier', assert => {
  assert.plan(1);
  const tenderOne = {
    ocid: 'tenderOne',
    awards: [ { suppliers: [ { _id: 'supplierOne' } ] } ]
  };
  const tenderTwo = {
    ocid: 'tenderTwo',
    awards: [ { suppliers: [ { _id: 'supplierOne' } ] } ]
  };
  const tenderThree = {
    ocid: 'tenderThree',
    awards: [ { suppliers: [ { _id: 'supplierTwo' } ] } ]
  };
  const collection = [ tenderOne, tenderTwo, tenderThree ];
  const expectedResult = {
    supplierOne: [ tenderOne, tenderTwo ],
    supplierTwo: [ tenderThree ]
  };
  const result = groupBySupplier(collection);
  assert.deepEqual(result, expectedResult);
});

test('groupBySupplier handles tenders with multiple suppliers (one award, two suppliers)', assert => {
  assert.plan(1);
  const tender = {
    ocid: 'exampleTender',
    awards: [ {
      suppliers: [ { _id: 'supplierOne' }, { _id: 'supplierTwo' } ]
    } ]
  };
  const collection = [ tender ];
  const expectedResult = {
    supplierOne: [ tender ],
    supplierTwo: [ tender ]
  };
  const result = groupBySupplier(collection);
  assert.deepEqual(result, expectedResult);
});

test('groupBySupplier handles tenders with multiple suppliers (two awards, one supplier each)', assert => {
  assert.plan(1);
  const tender = {
    ocid: 'exampleTender',
    awards: [
      { suppliers: [ { _id: 'supplierOne' } ] },
      { suppliers: [ { _id: 'supplierTwo' } ] }
    ]
  };
  const collection = [ tender ];
  const expectedResult = {
    supplierOne: [ tender ],
    supplierTwo: [ tender ]
  };
  const result = groupBySupplier(collection);
  assert.deepEqual(result, expectedResult);
});

test('groupBySupplier can optionally group only successful (active) awards', assert => {
  assert.plan(1);
  assert.plan(1);
  const tenderOne = {
    ocid: 'tenderOne',
    awards: [ { status: 'active', suppliers: [ { _id: 'supplierOne' } ] } ]
  };
  const tenderTwo = {
    ocid: 'tenderTwo',
    awards: [ { status: 'unsuccessful', suppliers: [ { _id: 'supplierOne' } ] } ]
  };
  const tenderThree = {
    ocid: 'tenderThree',
    awards: [ { status: 'active', suppliers: [ { _id: 'supplierTwo' } ] } ]
  };
  const collection = [ tenderOne, tenderTwo, tenderThree ];
  const expectedResult = {
    supplierOne: [ tenderOne ],
    supplierTwo: [ tenderThree ]
  };
  const result = groupBySupplier(collection, { successfulOnly: true });
  assert.deepEqual(result, expectedResult);
});
