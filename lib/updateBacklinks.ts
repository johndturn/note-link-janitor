// import type { BlockContent, ListItem, PhrasingContent } from 'mdast';
import type { Root, BlockContent } from 'mdast';

import getBacklinksBlock from './getBacklinksBlock.js';
import { getConfigFromPackageJson } from './getConfigFromPackage.js';
import { getProcessor } from './processor.js';

export interface BacklinkEntry {
  sourceTitle: string;
  context: BlockContent[];
}

const config = await getConfigFromPackageJson(1);

export default function updateBacklinks(tree: Root, noteContents: string, backlinks: BacklinkEntry[]): string {
  let insertionOffset: number;
  let oldEndOffset: number = -1;

  const backlinksSectionTitle = config?.config?.noteLinkJanitor?.backlinksTitle || 'References';

  const backlinksInfo = getBacklinksBlock(tree);
  if (backlinksInfo.isPresent) {
    insertionOffset = backlinksInfo.start.position!.start.offset!;
    oldEndOffset = backlinksInfo.until ? backlinksInfo.until.position!.start.offset! : noteContents.length;
  } else {
    insertionOffset = backlinksInfo.insertionPoint
      ? backlinksInfo.insertionPoint.position!.start.offset!
      : noteContents.length;
  }

  if (oldEndOffset === -1) {
    oldEndOffset = insertionOffset;
  }

  let backlinksString = '';
  if (backlinks.length > 0) {
    const processor = getProcessor();

    backlinksString = `\n## ${backlinksSectionTitle}\n\n${backlinks
      .map(
        entry =>
          `* [[${entry.sourceTitle}]]\n${entry.context
            // TODO: Figure out the typing issue here
            // eslint-disable-next-line
            // @ts-expect-error
            .map(block => `\t* ${processor.stringify(block as Root).replace(/\n.+/, '')}\n`)
            .join('')}`,
      )
      .join('')}\n`;
  }

  const newNoteContents = noteContents.slice(0, insertionOffset) + backlinksString + noteContents.slice(oldEndOffset);
  return newNoteContents;
}
