
window.markdownDiagram.ajax('demo.md', function(md) {
  var output = window.markdownDiagram.generate(md, {
    selectors: {
      parent: '#services'
    }
  });
  var diagram = document.createElement('section');
  diagram.innerHTML = output.svg;
  document.body.appendChild(diagram);
  var content = document.createElement('section');
  content.innerHTML = output.html;
  document.body.appendChild(content);
});
