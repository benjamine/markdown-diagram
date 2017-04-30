#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import _ from 'lodash';
import markdownDiagram from '../src/main';
import program from 'commander';
import packageInfo from '../package.json';

let sourceFile;
let additionalOptions = {};
program
  .version(packageInfo.version)
  .usage('[options] <file>')
  .option('-f, --format [format]', 'Output format: html, svg or dot', 'html')
  .option('--no-fork-me', 'remove "fork me" banner from html output')
  .option('-p, --parent [selector]', 'parent css selector')
  .action(file => {
    sourceFile = file;
  })
  .parse(process.argv);

const content = fs.readFileSync(sourceFile || '/dev/stdin').toString();
const output = markdownDiagram.generate(content);

(function() {
  if (program.format === 'dot') {
    console.log(output.dot);
    return;
  }
  if (program.format === 'svg') {
    console.log(output.svg);
    return;
  }
  additionalOptions.noForkMe = !program.forkMe;
  // full html doc
  const template = _.template(fs.readFileSync(path.join(__dirname, 'template.html')));
  const html = template(_.merge(output, additionalOptions));
  console.log(html);
})();
