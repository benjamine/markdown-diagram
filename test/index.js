/*
* mocha's bdd syntax is inspired in RSpec
*   please read: http://betterspecs.org/
*/
require('./util/globals');
var fs = require('fs');
var path = require('path');

describe('markdownDiagram', function() {
  before(function() {
  });
  it('has a semver version', function() {
    expect(markdownDiagram.version).to.match(/^\d+\.\d+\.\d+(-.*)?$/);
  });
  describe('#generate', function() {
    it('outputs svg', function(done) {
      function processMarkdown(md) {
        var output = markdownDiagram.generate(md);
        expect(output.svg).to.match(/<svg[\s\S]*<\/svg>/i);
        done();
      }
      var md;
      if (process.browser) {
        // markdownDiagram.ajax('/public/demo/demo.md', processMarkdown);
        done();
        return;
      } else {
        md = fs.readFileSync(path.join(__dirname, '..', 'public', 'demo', 'demo.md')).toString();
        processMarkdown(md);
      }
    });
  });
});
