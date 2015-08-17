var _ = require('lodash');
var cheerio = require('cheerio');
var MarkdownIt = require('markdown-it');
var markdownItAnchor = require('markdown-it-anchor');

function requireVizJs() {
  if (process.browser) {
    if (!window.Viz) {
      throw new Error('viz.js not loaded');
    }
    return window.Viz;
  }
  var moduleName = 'viz' + '.js';
  return require(moduleName);
}
var viz = requireVizJs();

var markdownIt = new MarkdownIt()
  .use(markdownItAnchor, {
    permalink: true
  });

var defaultOptions = {
  selectors: {
    parent: 'h1,h2,h3,h4',
    itemLinks: 'a'
  }
};

function generate(md, options) {
  var output = {};
  var html = markdownIt.render(md);
  output.html = html;
  var $ = cheerio.load(html);
  var opt = _.merge(_.cloneDeep(defaultOptions), options);

  var dot = ['digraph {'];

  var title = '';

  var items;

  var parentElement = $(opt.selectors.parent).first();
  var parentTagName = parentElement.get(0).tagName;
  if (/h\d/i.test(parentTagName)) {
    // parent is a title, look for next sibling elements
    if (!opt.selectors.item) {
      opt.selectors.item = parentTagName.slice(0, 1) +
        (parseInt(parentTagName.slice(1, 2)) + 1);
    }
    items = parentElement.nextUntil(parentTagName);
    items = items.find(opt.selectors.item).addBack().filter(opt.selectors.item);
  } else if (/[uo]l/i.test(parentTagName)) {
    // parent is a list, look for list items
    if (!opt.selectors.item) {
      opt.selectors.item = 'li';
    }
  }
  items = items || parentElement.find(opt.selectors.item || 'h2');
  title = opt.title || parentElement.text().trim();

  opt.selectors.item = opt.selectors.item || 'h2';

  title = title || opt.title;
  if (title) {
    title = title.replace(/¶/g, '').trim();
    dot.push('labelloc="t";');
    dot.push('label="' + title + '";');
  }

  var itemsByUrl = {};
  items.each(function(index, element) {
    var item = $(element);
    itemsByUrl[item.find('a').attr('href')] = item;
  });
  function itemTitle(item) {
     return item.text().replace(/[^\w\d -_,;\.]/ig, '').trim();
  }
  items.each(function(index, element) {
    var item = $(element);
    var itemContent = item.nextUntil(opt.selectors.item);
    var links = itemContent.find(opt.selectors.itemLinks);
    dot.push('  "' + itemTitle(item) + '" [shape=box, URL="' + item.find('a').attr('href') + '"];');
    links.each(function(index, linkElement) {
      var link = $(linkElement);
      var targetItem = itemsByUrl[link.attr('href')];
      if (targetItem) {
        var relationText = link.prev().text().trim();
        var label = relationText ? ' [label="' + relationText + '"]' : '';
        dot.push('  "' + itemTitle(item) + '" -> "' + itemTitle(targetItem) +
          '"' + label + ';');
      }
    });
  });

  dot.push('}');
  dot = dot.join('\n');

  output.dot = dot;
  output.svg = viz(dot, 'svg')
    .replace(/<title>%3<\/title>/i, '<title>' + title + '</title>');
  output.title = title;
  return output;
}

exports.generate = generate;
