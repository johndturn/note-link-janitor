import fs from 'fs';
import type { Root, Heading } from 'mdast';
import * as path from 'path';

import getNoteLinks, { NoteLinkEntry } from './getNoteLinks.js';
import { getProcessor, getHeadingFinder } from './processor.js';

export interface Note {
  title: string;
  fileName: string;
  notePath: string;
  links: NoteLinkEntry[];
  noteContents: string;
  parseTree: Root;
}

export default async function readAllNotes(noteFolderPaths: string[]): Promise<{ [key: string]: Note }> {
  const notesForPath: { [key: string]: Note } = {};

  for (const noteFolderPath of noteFolderPaths) {
    const noteDirectoryEntries = await fs.promises.readdir(noteFolderPath, {
      withFileTypes: true,
    });

    const noteFileNames = noteDirectoryEntries
      .filter(entry => entry.isFile() && !entry.name.startsWith('.') && entry.name.endsWith('.md'))
      .map(entry => entry.name);

    for (const noteFileName of noteFileNames) {
      const note = await readNote(noteFileName, noteFolderPath);
      notesForPath[note.notePath] = note;
    }
  }

  return notesForPath;
}

async function readNote(noteName: string, noteFolderPath: string): Promise<Note> {
  const notePath = path.join(noteFolderPath, noteName);
  const noteContents = await fs.promises.readFile(notePath, {
    encoding: 'utf-8',
  });

  const processor = getProcessor();
  const parseTree = processor.parse(noteContents);

  const headingNode = await getHeadingFinder().run(parseTree);
  if (headingNode.type === 'missingTitle') {
    throw new Error(`${noteName} has no title`);
  }

  const title = processor()
    .stringify({ type: 'root', children: (headingNode as Heading).children })
    .trimEnd();

  const links = getNoteLinks(parseTree);

  return { title, fileName: noteName, notePath, links, parseTree, noteContents };
}
