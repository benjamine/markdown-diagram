import cheerio from 'cheerio';
import MarkdownIt from 'markdown-it';

import markdownItAnchor from 'markdown-it-anchor';
import markdownItHighlighjs from 'markdown-it-highlightjs';
const markdownIt = new MarkdownIt();

markdownIt.use(markdownItAnchor, {
  permalink: true,
  permalinkBefore: true
});
markdownIt.use(markdownItHighlighjs);

export function parseMarkdown(md, options) {
  const html = markdownIt.render(md);
  return parseHtml(html, options);
}

function elementText(element) {
  return element.text().replace(/[^\w\d -_,;.]/ig, '').trim();
}

const selectors = {
  header: 'h1,h2,h3,h4,h5',
  link: 'a',
  // lists can be <ul>, <ol> or as a <table>
  list: 'ul,ol,table',
  listItems: 'li,' +
    // for tables, take only the first column
    'tbody > tr > td:first-child'
};

export function parseHtml(html, parseOptions) {
  const $ = cheerio.load(html);
  const headers = parseOptions.parent
    ? $(parseOptions.parent).find(selectors.header)
    : $(selectors.header);

  const sections = headers.map((index, element) => {
    const $element = $(element);

    // get ids of children sections
    const children = $element.nextUntil(element.tagName)
      .filter(selectors.header)
      .map((index, child) => $(child).attr('id'))
      .get();

    const content = $element.nextUntil(selectors.header);

    // find links between sections
    const links = content.find(selectors.link).filter((index, element) =>
        /^#.+/.test($(element).attr('href'))
      ).map((index, element) => ({
        to: $(element).attr('href').replace(/^#/, ''),
        text: elementText($(element)),
        relationshipText: elementText($(element).prev())
      })).get();

    // find lists (ul, ol or table) in the content
    const lists = content.filter(selectors.list).map((index, listElement) => ({
      title: elementText($(listElement).prev()).replace(/:.*$/, ''),
      items: $(listElement).find(selectors.listItems).map((index, listItem) => ({
        title: elementText($(listItem)).replace(/:.*$/, '')
      })).get()
    })).get();

    return {
      id: $element.attr('id'),
      title: elementText($element),
      children,
      links,
      lists
    };
  }).get();
  return {
    sections: sections.slice(1),
    root: sections[0],
    title: sections[0].title,
    html
  };
}
