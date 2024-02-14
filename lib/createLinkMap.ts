import type { BlockContent } from 'mdast';

import type { Note } from './Note.js';

export default function createLinkMap(notes: Note[]) {
  const linkMap: Map<string, Map<string, BlockContent[]>> = new Map();

  for (const note of notes) {
    console.log('>>> Working on the note: ', note.title);
    console.log('>>> Links: ', note.links);

    for (const link of note.links) {
      console.log('>>> Link: ', link);

      const targetTitle = link.targetTitle;
      let backlinkEntryMap = linkMap.get(targetTitle);

      if (!backlinkEntryMap) {
        backlinkEntryMap = new Map();
        linkMap.set(targetTitle, backlinkEntryMap);
      }

      let contextList = backlinkEntryMap.get(note.title);
      if (!contextList) {
        contextList = [];
        backlinkEntryMap.set(note.title, contextList);
      }

      if (link.context) {
        contextList.push(link.context);
      }
    }
  }

  return linkMap;
}
