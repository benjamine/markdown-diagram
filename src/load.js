import {generate} from './generator';
import ajax from './ajax';

function renderOutput(output, options) {
  const container = document.createElement('div');
  const diagram = document.createElement('section');
  diagram.setAttribute('class', 'diagram');
  diagram.innerHTML = output.svg;
  container.appendChild(diagram);
  if (options.includeContent !== false) {
    const content = document.createElement('section');
    content.setAttribute('class', 'content');
    content.innerHTML = output.html;
    container.appendChild(content);
  }
  if (output.title && !document.querySelector('h1')) {
    document.title = output.title;
  }
  document.body.appendChild(container);
}

export default function load(options = {}) {
  if (!options.selectors) {
    options.selectors = {};
  }

  if (options.url) {
    ajax(options.url, function(source) {
      const output = generate(source, options);
      renderOutput(output, options);
    });
    return;
  }
  const output = generate(document.body.innerHTML, options);
  renderOutput(output, options);
}
