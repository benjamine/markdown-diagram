import {parseMarkdown} from './parser';
import {render} from './render-viz';

export function generate(md, options) {
  const doc = parseMarkdown(md, options);
  return render(doc, options);
}
