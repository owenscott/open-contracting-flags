const groupBySupplier = (collection, options) => {
  const DEFAULT_OPTIONS = { successfulOnly: false };
  const { successfulOnly } = Object.assign({}, DEFAULT_OPTIONS, options);
  const bySupplier = {};
  collection.forEach(tender => {
    tender.awards.forEach(award => {
      if (!successfulOnly || award.status === 'active') {
        award.suppliers.forEach(supplier => {
          bySupplier[supplier._id] = bySupplier[supplier._id] || [];
          bySupplier[supplier._id].push(tender);
        });
      }
    });
  });
  return bySupplier;
};

module.exports = groupBySupplier;
