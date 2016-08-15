var _ = require('lodash');
var cheerio = require('cheerio');
var MarkdownIt = require('markdown-it');

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

var markdownIt = new MarkdownIt();
markdownIt.use(require('markdown-it-anchor'), {
  permalink: true,
  permalinkBefore: true
});
markdownIt.use(require('markdown-it-highlightjs'));

var defaultOptions = {
  selectors: {
    parent: 'h1,h2,h3,h4',
    itemLinks: 'a',
    itemPropertyList: 'ul,ol,dl',
    itemPropertyListItem: 'li,dt'
  }
};

function generate(md, options) {
  var output = {};
  var html = markdownIt.render(md);
  output.html = html;
  var $ = cheerio.load(html);
  var opt = _.merge(_.cloneDeep(defaultOptions), options);

  var dot = ['digraph {'];

  var title = opt.title || '';

  var items;

  var parentSelector = opt.selectors.parent;
  if (/^[\w\d\-]+$/.test(parentSelector)) {
    parentSelector += ',#' + parentSelector;
  }

  var parentElement = $(parentSelector).first();
  if (parentElement.length) {
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
    title = title || parentElement.text().trim();
  } else {
    title = 'parent element not found';
  }

  opt.selectors.item = opt.selectors.item || 'h2';

  if (title) {
    title = title.replace(/¶/g, '').trim();
    dot.push('labelloc="t";');
    dot.push('label="' + title + '";');
  }

  function itemTitle(item) {
     return item.text().replace(/[^\w\d -_,;\.]/ig, '').trim();
  }

  if (items && items.length) {
    var itemsByUrl = {};
    items.each(function(index, element) {
      var item = $(element);
      itemsByUrl[item.find('a').attr('href')] = item;
    });
    items.each(function(index, element) {
      var item = $(element);
      var itemContent = item.nextUntil(opt.selectors.item);

      var dotShape = 'box';

      var propertyList = itemContent.filter(opt.selectors.itemPropertyList);
      var properties = propertyList.filter(function(index, listElement) {
        return /properties:?\s*$/i.test($(listElement).prev().text());
      })
      .first().find(opt.selectors.itemPropertyListItem);

      dot.push('  "' + itemTitle(item) + '" [shape=' + dotShape + ', ');

      if (!(properties && properties.length)) {
        dot.push('label="' + itemTitle(item) + '", ');
      } else {
        dot.push('label=<' +
          '<TABLE CELLPADDING="0" CELLSPACING="0" BORDER="0">' +
          '<TR><TD>' + itemTitle(item) + '</TD></TR>' +
          '<TR><TD>' +
            '<FONT POINT-SIZE="8">' +
            '<TABLE CELLPADDING="0" CELLSPACING="0" BORDER="0">');
        properties.each(function(index, propertyElement) {
          dot.push('<TR><TD>' + $(propertyElement).text() + '</TD></TR>');
        });
        dot.push(
            '</TABLE>' +
            '</FONT>' +
          '</TD></TR>' +
          '</TABLE>' +
       '>, ');
      }
      dot.push(' URL="' + item.find('a').attr('href') + '"];');

      var links = itemContent.find(opt.selectors.itemLinks);
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
  }

  dot.push('}');
  dot = dot.join('\n');

  output.dot = dot;

  var svg = viz(dot, 'svg');

  svg = svg.replace(/<title>%3<\/title>/i, '<title>' + title + '</title>');

  var defs= '<defs>\n'+
    '    <filter color-interpolation-filters="sRGB" x="-0.15" width="1.3" y="-0.15" height="1.3" id="squiggle">\n'+
    '        <feTurbulence baseFrequency="0.008" type="fractalNoise" seed="47" numOctaves="4" />\n'+
    '        <feDisplacementMap in="SourceGraphic" xChannelSelector="R" yChannelSelector="B" scale="13.5" />\n'+
    '    </filter>\n'+
    '</defs>';

  svg = svg.replace('<g', defs + '\n<g');

  output.svg = svg;
  output.title = title;
  return output;
}

exports.generate = generate;
