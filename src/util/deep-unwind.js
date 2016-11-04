const Immutable = require('immutable');

const unwind = (record, oldKey, newKey) => {
  const section = Immutable.fromJS(record).getIn(oldKey).toJS();
  if (Array.isArray(section)) {
    const newRecords = section
      .map(child => {
        const newRecord = Immutable
          .fromJS(record)
          .setIn(newKey, child)
          .deleteIn(oldKey)
          .toJS();
        return newRecord;
      });
    return newRecords;
  } else {
    if (JSON.stringify(oldKey) !== JSON.stringify(newKey)) {
      throw new Error('Renaming non-array fields in deepUnwind not supported.');
    }
    return [ record ];
  }
};

function deepUnwind(collection, fieldMapping, newFieldMapping) {

  const oldKeys = fieldMapping.split('.');
  const newKeys = newFieldMapping.split('.');

  if (oldKeys.length !== newKeys.length) {
    throw new Error('Field mappings must be the same length');
  }

  let result = collection;

  for (let i = 0; i < oldKeys.length; i++) {

    const oldKey = newKeys.slice(0, i).concat(oldKeys.slice(i, i + 1));
    const newKey = newKeys.slice(0, i + 1);

    let newResult = [];

    result.forEach(record => {
      newResult = newResult.concat(unwind(record, oldKey, newKey));
    });

    result = newResult;

  }

  return result;

};

module.exports = deepUnwind;
