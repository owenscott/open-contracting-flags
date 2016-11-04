const test = require('tape');
const i180 = require('../i180.js');

test('i180 should return null for no data', assert => {
  assert.plan(1);
  assert.strictEqual(i180([]), null);
});

test('i180 should NOT flag a contract if it is the only sole source contract for a supplier', assert => {
  assert.plan(2);
  const collection = [
    {
      ocid: 'tenderOne',
      tender: {
        procurementMethod: 'limited',
        procuringEntity: { identifier: { _id: 'theGovernment' } }
      },
      awards: [
        {
          date: new Date('2016-01-01'),
          status: 'active',
          suppliers: [ { _id: 'supplierOne' } ]
        }
      ]
    }
  ];
  const collectionString = JSON.stringify(collection);
  const result = i180(collection, { threshold: 365 });
  assert.deepEqual(result, { tenderOne: false });
  assert.strictEqual(JSON.stringify(collection), collectionString, 'not mutated');
});

test('i180 should NOT flag two contracts if they are both sole-source but outside of the threshold', assert => {
  assert.plan(2);
  const collection = [
    {
      ocid: 'tenderOne',
      tender: {
        procurementMethod: 'limited',
        procuringEntity: { identifier: { _id: 'theGovernment' } }
      },
      awards: [
        {
          date: new Date('2014-01-01'),
          status: 'active',
          suppliers: [ { _id: 'supplierOne' } ]
        }
      ]
    },
    {
      ocid: 'tenderTwo',
      tender: {
        procurementMethod: 'limited',
        procuringEntity: { identifier: { _id: 'theGovernment' } }
      },
      awards: [
        {
          date: new Date('2016-01-01'), // 2 years apart
          status: 'active',
          suppliers: [ { _id: 'supplierOne' } ]
        }
      ]
    }
  ];
  const collectionString = JSON.stringify(collection);
  const result = i180(collection, { threshold: 365 });
  assert.deepEqual(result, { tenderOne: false, tenderTwo: false });
  assert.strictEqual(JSON.stringify(collection), collectionString, 'not mutated');
});

test('i180 should flag two contracts if they are both sole-source and within the threshold', assert => {
  assert.plan(2);
  const collection = [
    {
      ocid: 'tenderOne',
      tender: {
        procurementMethod: 'limited',
        procuringEntity: { identifier: { _id: 'theGovernment' } }
      },
      awards: [
        {
          date: new Date('2014-01-01'),
          status: 'active',
          suppliers: [ { _id: 'supplierOne' } ]
        }
      ]
    },
    {
      ocid: 'tenderTwo',
      tender: {
        procurementMethod: 'limited',
        procuringEntity: { identifier: { _id: 'theGovernment' } }
      },
      awards: [
        {
          date: new Date('2014-02-01'), // 1 month apart
          status: 'active',
          suppliers: [ { _id: 'supplierOne' } ]
        }
      ]
    }
  ];
  const collectionString = JSON.stringify(collection);
  const result = i180(collection, { threshold: 365 });
  assert.deepEqual(result, { tenderOne: true, tenderTwo: true });
  assert.strictEqual(JSON.stringify(collection), collectionString, 'not mutated');
});
