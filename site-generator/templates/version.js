const releaseIndicator = require('./release-indicator.js');
const collectionIndicator = require('./collection-indicator.js');

const template = ({version, indicators}) => `
  <html>
    <head>
      <title>OCDS Red Flags Version ${version}</title>
      <link rel="stylesheet" href="../style.css" />
      <link rel="stylesheet" href="version.css" />
    </head>
    <body>
      <div class="container">
        <h1>Open Contracting Red Flags</h1>
        <h2>Release Indicators</h2>
        ${
          indicators
            .filter(i => i.type === 'release')
            .map(i => releaseIndicator(i))
            .join('\n')
        }
        <h2>Collection Indicators</h2>
        ${
          indicators
            .filter(i => i.type === 'collection')
            .map(i => collectionIndicator(i))
            .join('\n')
        }
      </div>
    </body>
  </html>
`.trim();

module.exports = template;
