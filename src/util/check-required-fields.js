function checkField(release, field) {
  let ref = release;
  const keys = field.split('.');
  for (let i = 0; i < keys.length; i++) {
    ref = ref[keys[i]];
    if (typeof ref === 'undefined') {
      return false;
    } else if (Array.isArray(ref)) {
      return ref.reduce((result, child) => {
        const childField = keys.slice(i + 1, keys.length).join('.');
        const childOk = checkField(child, childField);
        return childOk ? result : false;
      }, true);
    }
  }
  return true;
};

const checkRequiredFields = (release, fields) => {
  const errors = [];
  fields.forEach(field => {
    if (!checkField(release, field)) {
      errors.push(`field "${field}" is required`);
    }
  });
  return errors.length > 0 ? errors : null;
};

module.exports = checkRequiredFields;
