const template = ({ versions }) => `
  <html>
    <head>
      <title>OCDS Red Flag Indicators</title>
      <link rel="stylesheet" href="style.css" />
    </head>
    <body>
      <div class="container">
        <h2>Versions</h2>
        <ul>
          ${versions.map(v => `<li><a href="versions/${v}">${v.slice(0, v.indexOf('.html'))}</a></li>`)}
        </ul>
      </div>
    </body>
  </html>
`.trim();

module.exports = template;
