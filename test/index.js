require('babel-register');
require('../src/safe-babel-polyfill');
require('./util/globals');

const fs = require('fs');
const path = require('path');
const markdownDiagram = require('../src/main');
/* globals describe, it, expect */

describe('markdownDiagram', function() {
  describe('#generate', function() {
    it('outputs svg', function(done) {
      console.log('testing svg output');
      function processMarkdown(md) {
        const output = markdownDiagram.generate(md);
        console.log('got output');
        expect(output.svg).to.match(/<svg[\s\S]*<\/svg>/i);
        done();
      }
      if (process.browser) {
        // markdownDiagram.ajax('/docs/page/help.md', processMarkdown);
        done();
        return;
      }
      const filename = path.join(__dirname, '..', 'public', 'page', 'help.md');
      const md = fs.readFileSync(filename).toString();
      console.log('got md');
      processMarkdown(md);
    });
  });
});
