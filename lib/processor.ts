import { remark } from 'remark';
import remarkWikiLink from 'remark-wiki-link';
import { find } from 'unist-util-find';

// TODO: Fix this so it actually works with the new version of the unified stack
// function allLinksHaveTitles() {
//   const Compiler = this.Compiler;
//   const visitors = Compiler.prototype.visitors;
//   const original = visitors.link;

//   console.log({ Compiler, visitors, original });

//   visitors.link = function (linkNode) {
//     return original.bind(this)({
//       ...linkNode,
//       title: linkNode.title || '',
//     });
//   };
// }

export function getProcessor() {
  return (
    remark()
      // .use(allLinksHaveTitles)
      .use(remarkWikiLink)
  );
}

export function getHeadingFinder() {
  const missingTitleSentinel = { type: 'missingTitle' } as const;

  return getProcessor().use(() => tree => find(tree, { type: 'heading', depth: 1 }) || missingTitleSentinel);
}
