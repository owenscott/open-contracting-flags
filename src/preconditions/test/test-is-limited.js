const test = require('tape');
const isLimited = require('../is-limited.js');

test('isLimited should return true when tender.procurementMethod !== \'limited\'', assert => {
  assert.plan(1);
  const release = { tender: { procurementMethod: 'open' } };
  assert.strictEqual(isLimited(release), false);
});

test('isLimited should return true when tender.procurementMethod === \'limited\'', assert => {
  assert.plan(1);
  const release = { tender: { procurementMethod: 'limited' } };
  assert.strictEqual(isLimited(release), true);
});
