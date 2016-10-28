const test = require('tape');
const dateToString = require('../date-to-string.js');

test.skip('dateToString does not affect unspecified fields', assert => {
  const release = { foo: 'bar' };
  const result = dateToString(release);
  assert.deepEqual(result, release);
});

test('dateToString mutates a date to a string', assert => {
  assert.plan(1);
  const release = { foo: new Date('2015-02-12') };
  dateToString(release, 'foo');
  assert.strictEqual(release.foo, '2015-02-12T00:00:00.000Z');
});

test('dateToString works on a nested field', assert => {
  assert.plan(1);
  const release = { tender: { tenderPeriod: { startDate: new Date('2014-01-02') } } };
  dateToString(release, 'tender.tenderPeriod.startDate');
  assert.strictEqual(release.tender.tenderPeriod.startDate, '2014-01-02T00:00:00.000Z');
});

test('dateToString is noop if the date field does not exist', assert => {
  assert.plan(1);
  const release = { awards: [] };
  dateToString(release, 'tender.tenderPeriod.startDate');
  assert.deepEqual(release, { awards: [] });
});
