// import type { BlockContent, ListItem, PhrasingContent } from 'mdast';
import type { Root, BlockContent } from 'mdast';

import getBacklinksBlock from './getBacklinksBlock.js';
import { getConfigFromPackageJson } from './getConfigFromPackage.js';
import { getProcessor } from './processor.js';

export interface BacklinkEntry {
  sourceNoteName: string;
  sourceNoteTitle: string;
  context: BlockContent[];
}

const packageJson = await getConfigFromPackageJson(1);

export default function updateBacklinks(tree: Root, noteContents: string, backlinks: BacklinkEntry[]): string {
  let insertionOffset: number;
  let oldEndOffset: number = -1;

  const backlinksSectionTitle = packageJson?.default?.config?.noteLinkJanitor?.backlinksTitle ?? 'References';

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
    const backlinksHeading = `\n## ${backlinksSectionTitle}\n\n`;
    const backlinksList = prepareBacklinksList(backlinks, processor);
    backlinksString = `${backlinksHeading}${backlinksList}`;
  }

  const newNoteContents = noteContents.slice(0, insertionOffset) + backlinksString + noteContents.slice(oldEndOffset);
  return newNoteContents;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function prepareBacklinksList(backlinks: BacklinkEntry[], processor: any): string {
  const shouldIncludeContext = packageJson?.default?.config?.noteLinkJanitor?.includeContextInBacklinks ?? true;

  // TODO: Alias the raw file of the link with the title of the note if possible

  if (shouldIncludeContext) {
    return backlinks
      .map(
        entry =>
          `* [[${entry.sourceNoteName}|${entry.sourceNoteTitle}]]\n${entry.context
            // TODO: Figure out the typing issue here
            // eslint-disable-next-line
            // @ts-expect-error
            .map(block => `\t* ${processor.stringify(block as Root).replace(/\n.+/, '')}\n`)
            .join('')}`,
      )
      .join('');
  }

  return backlinks.map(entry => `* [[${entry.sourceNoteName}|${entry.sourceNoteTitle}]]\n`).join('');
}
