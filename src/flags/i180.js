// I180: Contractor receives multiple single-source/non-competitive contracts from a single procuring entity during a defined time period

const moment = require('moment');
const {
  createCollectionIndicator,
  deepUnwind
} = require('../util');
const { hasAward, isLimited } = require('../preconditions');

const testFunction = (collection, options = {}) => {

  const { threshold } = options;

  const releasesUnwound = deepUnwind(collection, 'awards.suppliers', 'award.supplier')
    .filter(release => release.award.status === 'active');

  const bySupplierAndEntity = releasesUnwound
    .reduce((grouped, release) => {
      const supplierId = release.award.supplier._id;
      const entityId = release.tender.procuringEntity.identifier._id;
      grouped[supplierId] = grouped[supplierId] || {};
      grouped[supplierId][entityId] = grouped[supplierId][entityId] || [];
      grouped[supplierId][entityId].push(release);
      return grouped;
    }, {});

  const byContract = collection
    .map(release => release.ocid)
    .reduce((result, ocid) => Object.assign({}, result, { [ocid]: false }), {});

  // TODO: make this do wayyy less work
  for (let supplierId in bySupplierAndEntity) {
    for (let entityId in bySupplierAndEntity[supplierId]) {
      const releases = bySupplierAndEntity[supplierId][entityId];
      releases.sort((a, b) => a.award.date > b.award.date);
      for (let i = 0; i < releases.length - 1; i++) {
        for (let j = i + 1; j < releases.length; j++) {
          const daysBetween = moment(releases[j].award.date).diff(releases[i].award.date, 'days');
          if (daysBetween < threshold) {
            byContract[releases[i].ocid] = true;
            byContract[releases[j].ocid] = true;
          }
        }
      }
    }
  }

  return byContract;

};

const i180 = createCollectionIndicator('i180', testFunction, {
  requiredOCDSFields: [
    'ocid',
    'awards.status',
    'awards.date',
    'tender.procurementMethod'
  ],
  requiredCustomFields: [
    // TODO: should be .id (http://standard.open-contracting.org/latest/en/schema/release/#id1)
    'tender.procuringEntity.identifier._id',
    'awards.suppliers._id'
  ],
  filters: [ hasAward, isLimited ]
});

module.exports = i180;
