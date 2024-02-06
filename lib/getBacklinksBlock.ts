import type { Node } from 'unist';
import type { Html, Root, Heading } from 'mdast';
import { is } from 'unist-util-is';

// Hacky type predicate here.
function isClosingMatterNode(node: Node): node is Node {
  return 'value' in node && (node as Html).value.startsWith('<!--');
}

type BacklinksBlockPresent = {
  isPresent: true;
  start: Node;
  until: Node | null;
};

type BacklinksBlockNotPresent = {
  isPresent: false;
  insertionPoint: Node | null;
};

export default function getBacklinksBlock(tree: Root): BacklinksBlockPresent | BacklinksBlockNotPresent {
  const existingBacklinksNodeIndex = tree.children.findIndex(
    (node: Node): node is Heading =>
      is(node, {
        type: 'heading',
        depth: 2,
      }) && is((node as Heading).children[0], { value: 'Backlinks' }),
  );

  if (existingBacklinksNodeIndex === -1) {
    const insertionPoint =
      tree.children
        .slice()
        .reverse()
        .find(node => is(node, isClosingMatterNode)) || null;
    return {
      isPresent: false,
      insertionPoint,
    };
  } else {
    const followingNode =
      tree.children
        .slice(existingBacklinksNodeIndex + 1)
        .find(node => is(node, [{ type: 'heading' }, isClosingMatterNode])) || null;
    return {
      isPresent: true,
      start: tree.children[existingBacklinksNodeIndex],
      until: followingNode,
    };
  }
}
