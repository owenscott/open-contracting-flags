// i038: Allowing an unreasonable short time to respond to requests for bids

const test = require('tape');
const moment = require('moment');
const i038 = require('../i038.js');

test('i038 should return null if there is not date information', assert => {
  assert.plan(1);
  const release = {
    tender: {}
  };
  assert.strictEqual(i038(release), null);
});

test('i03 should return false if the date range is greater than the threshold', assert => {
  assert.plan(1);
  const release = {
    tender: {
      tenderPeriod: {
        startDate: new Date('2016-01-01'),
        endDate: new Date('2016-01-14')
      }
    }
  };
  const threshold = 7;
  assert.strictEqual(i038(release, threshold), false);
});

test('i03 should return false if the date range is less than the threshold', assert => {
  assert.plan(1);
  const release = {
    tender: {
      tenderPeriod: {
        startDate: new Date('2016-01-01'),
        endDate: new Date('2016-01-02')
      }
    }
  };
  const threshold = 7;
  assert.strictEqual(i038(release, threshold), true);
});

test('i03 should return true if the date range is equal to the threshold', assert => {
  assert.plan(1);
  const threshold = 7;
  const startDate = new Date('2016-01-01');
  const release = {
    tender: {
      tenderPeriod: {
        startDate: startDate,
        endDate: moment(startDate).add(threshold, 'days').toDate()
      }
    }
  };
  assert.strictEqual(i038(release, threshold), false);
});
