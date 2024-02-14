import { remark } from 'remark';
import remarkWikiLink from 'remark-wiki-link';
import { find } from 'unist-util-find';

export function getProcessor() {
  return remark().use(remarkWikiLink);
}

export function getHeadingFinder() {
  const missingTitleSentinel = { type: 'missingTitle' } as const;

  return getProcessor().use(() => tree => find(tree, { type: 'heading', depth: 1 }) || missingTitleSentinel);
}
