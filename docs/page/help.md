Markdown Diagram Help
====

How do you build a diagram for the structure in a markdown document? You're looking at [one](http://benjamine.github.io/markdown-diagram/page?url=./help.md).

Add a link to your document
---

On your markdown file, add a link to this page with the url param specifying where your markdown (or html) document is published.  [Example](?url=https://cdn.rawgit.com/benjamine/markdown-diagram/master/docs/page/services.md) (using [rawgit.com](http://rawgit.com)).

Optional query parameters:
- `?nocontent`: [diagram only](?nocontent) (don't include the content below the diagram)
- `?parent=#hyphenized-title-of-a-section`: will generate a diagram for the subsections of a specific section (the default is looking for the document root level section).

To get a diagram, *next you have to define* [sections](#sections).


Sections
---

Properties:

- a property of this section
- another property
- something else

2nd level sections (`h2`) will become items on the diagram (to specify another parent element, use `?parent=#title-of-the-section` on the url). All sections *have* [permalink](#permalinks), *use permalinks to* [link sections](#link-sections) to each other.

Permalinks
---

The title of each section will contain an anchor to permalink of that section (`#hyphenized-title-of-the-section`)

**Properties**

| Name      | Value |
|-----------|-------|
| property  |      1|
| tables    |      1|
| are       |      2|
| supported |      3|
| too       |      4|

Link Sections
---

if a section contains a link pointing to `#hyphenized-title-of-another-section` that will be shown as an arrow on the diagram.

Optionally this links *can have* [labels](#link-labels) that will be shown next to the arrow.

Link Labels
---

if the link is preceded by a bold or italic text (`span`), that becomes the label of that arrow.
