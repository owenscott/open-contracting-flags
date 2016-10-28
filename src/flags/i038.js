// Indicator 038: Allowing an unreasonable short time to respond to requests

const { createIndicator } = require('../util');

const testFunction = (release, options) => {
  const { threshold } = options;
  const { tender: { tenderPeriod: { startDate, endDate } } } = release;
  const daysBetween = (endDate.getTime() - startDate.getTime()) / (24 * 3600 * 1000);
  return daysBetween < threshold;
};

const i038 = createIndicator('i038', testFunction, {
  preconditions: [],
  requiredOCDSFields: [
    'tender.tenderPeriod.startDate',
    'tender.tenderPeriod.endDate'
  ],
  requiredCustomFields: []
});

module.exports = i038;
