const moment = require('moment');

const dateToString = (release, field) => {
  let ref = release;
  const steps = field.split('.');
  steps.forEach((step, i) => {
    if (i === steps.length - 1 && ref && ref[step]) {
      ref[step] = moment(ref[step]).toISOString();
    } else {
      ref = ref ? ref[step] : null;
    }
  });
  return release;
};

module.exports = dateToString;
