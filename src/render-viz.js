import vizjs from 'viz.js';

function renderDotSectionLink(section, link, sections) {
  const linkTo = sections.find(s => s.id === link.to);
  const linkToTitle = (linkTo && linkTo.title) || 'Not Found';
  return `"${section.title}" -> "${linkToTitle}"` +
    `${link.relationshipText ? ` [label="${link.relationshipText}"]` : ''}`;
}

function renderDotSectionLabel(section) {
  const properties = section.lists.find(list => /properties/i.test(list.title));
  if (!properties || properties.items.length < 1) {
    return `"${section.title}"`;
  }
  // if there are properties, use tables
  return `<<TABLE CELLPADDING="0" CELLSPACING="0" BORDER="0" TOOLTIP="${section.title}">` +
    `<TR><TD>${section.title}</TD></TR>` +
    `<TR><TD>` +
      `<FONT POINT-SIZE="8">` +
      `<TABLE CELLPADDING="0" CELLSPACING="0" BORDER="0">` +
      properties.items.map(property =>
        `<TR><TD TITLE="${property.title}">${property.title}</TD></TR>`
      ).join('') +
      `</TABLE>` +
      `</FONT>` +
    `</TD></TR>` +
  `</TABLE>>`;
}

function renderDotSection(section, sections) {
  // render a box for each section
  return `    "${section.title}" [shape=box,
          label=${renderDotSectionLabel(section)}
          URL="#${section.id}"
        ];
        ${section.links.map(link => renderDotSectionLink(section, link, sections))
          .join('\n        ')}
  `;
}

/*
  generates a graph in "dot" format
*/
export function renderDot({root, sections}) {
  return `digraph {
    labelloc="t";
    label="${root.title}"

${sections.map(section => renderDotSection(section, sections)).join('\n')}
  }`;
}

/*
  generates a graph rendered to svg with viz.js
*/
export function render(doc) {
  const dot = renderDot(doc);
  const defs = `<defs>
        <filter color-interpolation-filters="sRGB" x="-0.15" width="1.3" y="-0.15" height="1.3" id="squiggle">
            <feTurbulence baseFrequency="0.008" type="fractalNoise" seed="47" numOctaves="4" />
            <feDisplacementMap in="SourceGraphic" xChannelSelector="R" yChannelSelector="B" scale="13.5" />
        </filter>
    </defs>`;

  let viz = vizjs;
  if (!viz && process.browser) {
    if (!window.Viz) {
      throw new Error('viz.js not found');
    }
    viz = window.Viz;
  }

  try {
    const svg = viz(dot, 'svg')
      .replace(/<title>%0<\/title>/i, '<title>' + doc.root.title + '</title>')
      .replace('<g', defs + '\n<g');
    return {
      ...doc,
      dot,
      svg
    };
  } catch (err) {
    console.error(dot);
    throw err;
  }
}
