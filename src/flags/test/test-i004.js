// I004: Multiple sole source awards above or just below the sole source threshold

const test = require('tape');
const i004 = require('../i004.js');

test('i004 should return null for an empty collection', assert => {
  assert.plan(1);
  const collection = [];
  const result = i004(collection, { threshold: 0.05, soleSourceLimit: 1000 });
  assert.strictEqual(result, null);
});

test('i004 should return an empty object for a collection with no sole source awards', assert => {
  assert.plan(1);
  const collection = [
    {
      ocid: 'recordOne',
      tender: { procurementMethod: 'open' },
      awards: [
        {
          status: 'active',
          value: { amount: 1000 },
          suppliers: [ { _id: 'supplierOne' } ]
        }
      ]
    }
  ];
  const result = i004(collection, { threshold: 0.05, soleSourceLimit: 1000 });
  assert.strictEqual(result, null);
});

test('i004 should with the correct object for a collection with one sole source awards', assert => {
  assert.plan(1);
  const collection = [
    {
      ocid: 'recordOne',
      tender: { procurementMethod: 'limited' },
      awards: [
        {
          status: 'active',
          value: { amount: 1000 },
          suppliers: [ { _id: 'supplierOne' } ]
        }
      ]
    }
  ];
  const result = i004(collection, { threshold: 0.05, soleSourceLimit: 1000 });
  assert.deepEqual(result, { recordOne: false });
});

test('i004 should with the correct object for a collection with a supplier with multiple sole-source awards below the threshold', assert => {
  assert.plan(1);
  const collection = [
    {
      ocid: 'recordOne',
      tender: { procurementMethod: 'limited' },
      awards: [
        {
          status: 'active',
          value: { amount: 20 },
          suppliers: [ { _id: 'supplierOne' } ]
        }
      ]
    },
    {
      ocid: 'recordTwo',
      tender: { procurementMethod: 'limited' },
      awards: [
        {
          status: 'active',
          value: { amount: 20 },
          suppliers: [ { _id: 'supplierOne' } ]
        }
      ]
    }
  ];
  const result = i004(collection, { threshold: 0.05, soleSourceLimit: 1000 });
  assert.deepEqual(result, { recordOne: false, recordTwo: false });
});

test('i004 should with the correct object for a collection with a supplier with multiple sole-source awards at the threshold', assert => {
  assert.plan(1);
  const collection = [
    {
      ocid: 'recordOne',
      tender: { procurementMethod: 'limited' },
      awards: [
        {
          status: 'active',
          value: { amount: 1000 },
          suppliers: [ { _id: 'supplierOne' } ]
        }
      ]
    },
    {
      ocid: 'recordTwo',
      tender: { procurementMethod: 'limited' },
      awards: [
        {
          status: 'active',
          value: { amount: 1000 },
          suppliers: [ { _id: 'supplierOne' } ]
        }
      ]
    },
    {
      ocid: 'recordThree',
      tender: { procurementMethod: 'limited' },
      awards: [
        {
          status: 'active',
          value: { amount: 1000 },
          suppliers: [ { _id: 'supplierTwo' } ]
        }
      ]
    }
  ];
  const result = i004(collection, { threshold: 0.05, soleSourceLimit: 1000 });
  assert.deepEqual(result, { recordOne: true, recordTwo: true, recordThree: false });
});
