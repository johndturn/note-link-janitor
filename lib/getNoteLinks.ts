import type { RootContent, BlockContent, Parent, Root } from 'mdast';
import type { Node } from 'unist';
import { visitParents } from 'unist-util-visit-parents';

import getBacklinksBlock from './getBacklinksBlock.js';
import { WikiLinkNode } from './WikiLinkNode.js';

const blockTypes = ['paragraph', 'heading', 'thematicBreak', 'blockquote', 'list', 'table', 'html', 'code'];

function isBlockContent(node: RootContent): node is BlockContent {
  return blockTypes.includes(node.type);
}

export interface NoteLinkEntry {
  targetTitle: string;
  context: BlockContent | null;
}

export default function getNoteLinks(tree: Root): NoteLinkEntry[] {
  // Strip out the backlinks section
  const backlinksInfo = getBacklinksBlock(tree);
  let searchedChildren: Node[];

  if (backlinksInfo.isPresent) {
    searchedChildren = tree.children
      .slice(
        0,
        tree.children.findIndex(n => n === backlinksInfo.start),
      )
      .concat(
        tree.children.slice(
          backlinksInfo.until ? tree.children.findIndex(n => n === backlinksInfo.until) : tree.children.length,
        ),
      );
  } else {
    searchedChildren = tree.children;
  }

  const links: NoteLinkEntry[] = [];

  // TODO: Figure out what's happening here with the types
  // eslint-disable-next-line
  // @ts-expect-error
  visitParents<WikiLinkNode>(
    { ...tree, children: searchedChildren } as Parent,
    'wikiLink',
    (node: WikiLinkNode, ancestors: RootContent[]) => {
      const closestBlockLevelAncestor = ancestors.reduceRight<BlockContent | null>(
        (result, needle) => result ?? (isBlockContent(needle) ? needle : null),
        null,
      );

      // NOTE: In order to support wikilinks that have true aliases, we have to
      // remove the pipe character and any text after it in the node.data.alias string
      let linkText = node.data.alias;
      if (linkText && linkText.includes('|')) {
        linkText = linkText.split('|')[0];
      }

      links.push({
        targetTitle: linkText,
        context: closestBlockLevelAncestor,
      });

      return true;
    },
  );

  return links;
}
