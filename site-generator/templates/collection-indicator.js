const requiredFields = require('./required-fields.js');

const template = details => `
  <div class="indicator collection-indicator">
    <h3>${details.id}</h3>
    ${requiredFields({ ocds: true, fields: details.requiredOCDSFields })}
    ${requiredFields({ ocds: false, fields: details.requiredCustomFields })}
    <h4>Filters</h4>
    <ul class="preconditions">
      ${details.filters.length > 0 ? details.filters.map(({ name }) => `<li>${name}</li>`).join('\n') : 'None'}
    </ul>
  </div>
`;

module.exports = template;
