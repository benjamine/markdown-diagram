Markdown-Diagram
================

How do you build a diagram for the structure in a markdown document?  [Just read this one](http://benjamine.github.io/markdown-diagram/page?url=./help.md).

Command-line interface
---

In some cases (eg. if your documents are private) you might want to generate this diagrams offline.
You can use the CLI to get a static html file like this:

``` sh
npm i markdown-diagram -g
cat ./public/page/services.md | markdown-diagram > services.html
# OR
markdown-diagram ./public/page/services.md > services.html
```
