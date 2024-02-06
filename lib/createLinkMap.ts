import type { BlockContent } from 'mdast';

import { Note } from './Note.js';

export default function createLinkMap(notes: Note[]) {
  const linkMap: Map<string, Map<string, BlockContent[]>> = new Map();
  for (const note of notes) {
    for (const link of note.links) {
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
