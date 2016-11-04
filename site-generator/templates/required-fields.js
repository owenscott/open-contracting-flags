const template = ({ ocds, fields }) => `
  <h4>${ocds ? 'Required OCDS Fields' : 'Required Custom Fields'}</h4>
  <ul class="required-fields">
    ${fields.map(f => `<li>${f}</li>`).join('\n') || 'None'}
  </ul>
`.trim();

module.exports = template;
