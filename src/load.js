var generate = require('./generator').generate;
var ajax = require('./ajax');

function renderOutput(output, options) {
  var container = document.createElement('div');
  var diagram = document.createElement('section');
  diagram.setAttribute('class', 'diagram');
  diagram.innerHTML = output.svg;
  container.appendChild(diagram);
  if (options.includeContent !== false) {
    var content = document.createElement('section');
    diagram.setAttribute('class', 'content');
    content.innerHTML = output.html;
    container.appendChild(content);
  }
  if (output.title && !document.querySelector('h1')) {
    document.title = output.title;
  }
  document.body.appendChild(container);
}

function load(options) {
  var output;

  options = options || {};
  if (!options.selectors) {
    options.selectors = {};
  }
  if (!options.selectors.parent) {
    options.selectors.parent = 'h1,h2,h3,h4';
  }

  if (options.url) {
    ajax(options.url, function(source) {
      output = generate(source, options);
      renderOutput(output, options);
    });
    return;
  }
  output = generate(document.body.innerHTML, options);
  renderOutput(output, options);
}

module.exports = load;
