import RemarkParse from 'remark-parse';
import RemarkStringify from 'remark-stringify';
import RemarkWikiLink from 'remark-wiki-link';
import { unified } from 'unified';

// TODO: adopt the more general parser in incremental-thinking
// function allLinksHaveTitles() {
//   const Compiler = this.Compiler;
//   const visitors = Compiler.prototype.visitors;
//   const original = visitors.link;

//   visitors.link = function (linkNode) {
//     return original.bind(this)({
//       ...linkNode,
//       title: linkNode.title || '',
//     });
//   };
// }

const processor = unified()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  .use(RemarkParse as any, { commonmark: true, pedantic: true })
  .use(RemarkStringify, {
    bullet: '*',
    emphasis: '_',
    listItemIndent: 'one',
    rule: '-',
    ruleSpaces: false,
  })
  // .use(allLinksHaveTitles)
  .use(RemarkWikiLink);

export default processor;
